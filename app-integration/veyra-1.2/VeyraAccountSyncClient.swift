import Foundation

/// Transport for Veyra 1.2. The UI must keep a per-user durable outbox.
/// This client never caches credentials and never treats network failure as success.
struct VeyraAccountSyncClient {
    let baseURL: URL
    let publishableKey: String
    var transport: URLSession = .shared

    struct Session {
        let userID: UUID
        let accessToken: String
    }

    enum Collection: String, Codable {
        case academyFavorites = "academy_favorites"
        case learningProgress = "learning_progress"
        case flightLog = "flight_log"
        case pilotProfile = "pilot_profile"
        case studyPlan = "study_plan"
        case medicalReminders = "medical_reminders"
        case investmentFavorites = "investment_favorites"
        case priceRules = "price_rules"
    }

    struct Record<Payload: Codable>: Codable {
        let user_id: UUID
        let collection: Collection
        let record_id: String
        let payload: Payload
        let revision: Int64
        let deleted: Bool
        // Keep ISO8601 as returned, including fractional precision.
        let updated_at: String
    }

    struct Feature: Decodable {
        let feature: String
        let enabled: Bool
    }

    enum SyncError: Error {
        case invalidSession
        case conflict
        case forbidden
        case server(Int)
        case invalidResponse
    }

    private struct Write<Payload: Encodable>: Encodable {
        let p_collection: Collection
        let p_record_id: String
        let p_payload: Payload
        let p_expected_revision: Int64
        let p_deleted: Bool
    }

    private func request(path: String, query: [URLQueryItem] = [],
                         method: String = "GET", body: Data? = nil,
                         session: Session) async throws -> Data {
        guard !session.accessToken.isEmpty else { throw SyncError.invalidSession }
        var components = URLComponents(url: baseURL.appendingPathComponent(path),
                                       resolvingAgainstBaseURL: false)!
        components.queryItems = query.isEmpty ? nil : query
        guard let url = components.url else { throw SyncError.invalidResponse }
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.timeoutInterval = 30
        request.setValue(publishableKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer " + session.accessToken, forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = body
        let (data, response) = try await transport.data(for: request)
        guard let response = response as? HTTPURLResponse else { throw SyncError.invalidResponse }
        switch response.statusCode {
        case 200..<300: return data
        case 401: throw SyncError.invalidSession
        case 403: throw SyncError.forbidden
        case 409: throw SyncError.conflict
        default:
            // PostgreSQL 40001 is surfaced differently by PostgREST versions.
            if let error = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               error["code"] as? String == "40001" { throw SyncError.conflict }
            throw SyncError.server(response.statusCode)
        }
    }

    func features(session: Session) async throws -> [Feature] {
        let data = try await request(path: "rest/v1/veyra_feature_access",
            query: [.init(name: "select", value: "feature,enabled"),
                    .init(name: "user_id", value: "eq." + session.userID.uuidString)],
            session: session)
        return try JSONDecoder().decode([Feature].self, from: data)
    }

    /// Fetch a bounded page, including tombstones. Reconcile by record_id/revision.
    /// Caller must discard responses if the signed-in user changed during await.
    func records<P: Codable>(collection: Collection, offset: Int = 0,
                             session: Session, as type: P.Type) async throws -> [Record<P>] {
        let data = try await request(path: "rest/v1/veyra_sync_records",
            query: [.init(name: "select", value: "*"),
                    .init(name: "user_id", value: "eq." + session.userID.uuidString),
                    .init(name: "collection", value: "eq." + collection.rawValue),
                    .init(name: "order", value: "record_id.asc"),
                    .init(name: "limit", value: "200"),
                    .init(name: "offset", value: String(max(0, offset)))],
            session: session)
        let rows = try JSONDecoder().decode([Record<P>].self, from: data)
        guard rows.allSatisfy({ $0.user_id == session.userID }) else { throw SyncError.invalidResponse }
        return rows
    }

    /// expectedRevision=0 creates; subsequent writes must use the last confirmed revision.
    /// Never resolve a conflict by automatically replacing expectedRevision and retrying.
    func write<P: Codable>(collection: Collection, id: String, payload: P,
                           expectedRevision: Int64, deleted: Bool = false,
                           session: Session) async throws -> Record<P> {
        let body = try JSONEncoder().encode(Write(p_collection: collection,
            p_record_id: id, p_payload: payload,
            p_expected_revision: expectedRevision, p_deleted: deleted))
        let data = try await request(path: "rest/v1/rpc/veyra_sync_write",
                                    method: "POST", body: body, session: session)
        let row = try JSONDecoder().decode(Record<P>.self, from: data)
        guard row.user_id == session.userID && row.record_id == id &&
              row.collection == collection else { throw SyncError.invalidResponse }
        return row
    }
}
