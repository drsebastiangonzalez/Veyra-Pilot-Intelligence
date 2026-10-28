import SwiftUI

/// Online-first integration: never reports a favorite as saved before server confirmation.
@MainActor
final class VeyraInvestmentFavorites: ObservableObject {
    struct Favorite: Codable {
        let symbol: String
        let name: String
    }
    struct Asset: Identifiable {
        let id: String
        let name: String
    }
    static let assets: [Asset] = [
        .init(id: "BTC", name: "Bitcoin"), .init(id: "SOL", name: "Solana"),
        .init(id: "ETH", name: "Ethereum"), .init(id: "NASDAQ:META", name: "Meta"),
        .init(id: "NYSE:NKE", name: "Nike"), .init(id: "NASDAQ:ADBE", name: "Adobe"),
        .init(id: "NASDAQ:PYPL", name: "PayPal"), .init(id: "NYSE:NU", name: "Nu"),
        .init(id: "BVC:ECOPETROL", name: "Ecopetrol · Colombia"),
        .init(id: "NYSE:EC", name: "Ecopetrol · ADR Estados Unidos"),
        .init(id: "BVC:TERPEL", name: "Terpel")
    ]

    @Published private(set) var allowed = false
    @Published private(set) var busy = false
    @Published private(set) var loaded = false
    @Published private(set) var message: String?
    @Published private(set) var records: [String: VeyraAccountSyncClient.Record<Favorite>] = [:]

    private let userID: UUID
    private let client: VeyraAccountSyncClient
    private let sessionProvider: () -> VeyraAccountSyncClient.Session?
    private var generation = 0

    init(userID: UUID, client: VeyraAccountSyncClient,
         sessionProvider: @escaping () -> VeyraAccountSyncClient.Session?) {
        self.userID = userID
        self.client = client
        self.sessionProvider = sessionProvider
    }

    private func session() throws -> VeyraAccountSyncClient.Session {
        guard let value = sessionProvider(), value.userID == userID else {
            throw VeyraAccountSyncClient.SyncError.invalidSession
        }
        return value
    }

    private func isCurrent(_ operation: Int) -> Bool {
        generation == operation && sessionProvider()?.userID == userID
    }

    func clear() {
        generation += 1
        allowed = false
        busy = false
        loaded = false
        records = [:]
        message = nil
    }

    func isFavorite(_ symbol: String) -> Bool {
        guard let record = records[symbol] else { return false }
        return !record.deleted
    }

    func reload() async {
        guard !busy else { return }
        busy = true
        loaded = false
        message = nil
        let operation = generation
        defer { if generation == operation { busy = false } }
        do {
            let credential = try session()
            let features = try await client.features(session: credential)
            guard isCurrent(operation) else { return }
            allowed = features.contains { $0.feature == "investments" && $0.enabled }
            guard allowed else { records = [:]; return }
            var next: [String: VeyraAccountSyncClient.Record<Favorite>] = [:]
            var offset = 0
            while true {
                let page = try await client.records(collection: .investmentFavorites,
                    offset: offset, session: credential, as: Favorite.self)
                guard isCurrent(operation) else { return }
                for row in page { next[row.record_id] = row }
                if page.count < 200 { break }
                offset += page.count
            }
            records = next
            loaded = true
        } catch {
            guard isCurrent(operation) else { return }
            records = [:]
            message = errorMessage(error)
            // A failed permission check must never grant access.
            allowed = false
        }
    }

    func toggle(_ asset: Asset) async {
        guard allowed, loaded, !busy else { return }
        busy = true
        message = nil
        let operation = generation
        defer { if generation == operation { busy = false } }
        do {
            let credential = try session()
            // Re-check entitlement before each edit. RLS remains authoritative.
            let features = try await client.features(session: credential)
            guard isCurrent(operation) else { return }
            guard features.contains(where: { $0.feature == "investments" && $0.enabled }) else {
                clear()
                message = "Tu cuenta no tiene acceso a inversiones."
                return
            }
            let old = records[asset.id]
            let saved = try await client.write(collection: .investmentFavorites,
                id: asset.id, payload: Favorite(symbol: asset.id, name: asset.name),
                expectedRevision: old?.revision ?? 0,
                deleted: old.map { !$0.deleted } ?? false, session: credential)
            guard isCurrent(operation) else { return }
            records[asset.id] = saved
        } catch {
            guard isCurrent(operation) else { return }
            // Network failure may happen after a committed write. Reload before retrying.
            loaded = false
            message = errorMessage(error)
            if case VeyraAccountSyncClient.SyncError.forbidden = error {
                allowed = false
                records = [:]
            }
        }
    }

    private func errorMessage(_ error: Error) -> String {
        switch error {
        case VeyraAccountSyncClient.SyncError.invalidSession:
            return "Inicia sesión nuevamente para consultar tus favoritos."
        case VeyraAccountSyncClient.SyncError.forbidden:
            return "Tu cuenta no tiene acceso a inversiones."
        case VeyraAccountSyncClient.SyncError.conflict:
            return "Tus favoritos cambiaron en otro dispositivo. Actualiza antes de continuar."
        default:
            return "No pudimos confirmar los cambios. Actualiza con conexión antes de intentarlo otra vez."
        }
    }
}

struct VeyraInvestmentFavoritesView: View {
    @ObservedObject var store: VeyraInvestmentFavorites
    @Environment(\.dismiss) private var dismiss
    @State private var query = ""
    @State private var favoritesOnly = false

    private var assets: [VeyraInvestmentFavorites.Asset] {
        VeyraInvestmentFavorites.assets.filter {
            (!favoritesOnly || store.isFavorite($0.id)) &&
            (query.isEmpty || $0.name.localizedCaseInsensitiveContains(query) ||
             $0.id.localizedCaseInsensitiveContains(query))
        }
    }

    var body: some View {
        NavigationStack {
            List {
                if let message = store.message {
                    Section {
                        Text(message)
                        Button("Actualizar") { Task { await store.reload() } }
                            .disabled(store.busy)
                    }
                }
                if store.allowed {
                    Section {
                        Toggle("Solo favoritos", isOn: $favoritesOnly)
                    }
                    Section("Acciones y criptomonedas") {
                        ForEach(assets) { asset in
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(asset.name)
                                    Text(asset.id).font(.caption).foregroundStyle(.secondary)
                                }
                                Spacer()
                                Button {
                                    Task { await store.toggle(asset) }
                                } label: {
                                    Image(systemName: store.isFavorite(asset.id) ? "star.fill" : "star")
                                }
                                .accessibilityLabel((store.isFavorite(asset.id) ?
                                    "Quitar de favoritos: " : "Añadir a favoritos: ") + asset.name)
                                .disabled(store.busy || !store.loaded)
                            }
                        }
                        if assets.isEmpty { Text("No hay activos en esta selección.") }
                    }
                } else if !store.busy && store.message == nil {
                    Text("Este espacio está disponible solo para cuentas autorizadas.")
                }
            }
            .searchable(text: $query, prompt: "Buscar en la lista")
            .navigationTitle("Inversiones")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Cerrar") { dismiss() }
                }
                ToolbarItem(placement: .primaryAction) {
                    if store.busy { ProgressView() }
                }
            }
            .refreshable { await store.reload() }
        }
    }
}

/// Mount once per signed-in identity using .id(student.id).
/// Session provider must read the current authenticated session, never a captured old token.
struct VeyraInvestmentAccess<Content: View>: View {
    @StateObject private var store: VeyraInvestmentFavorites
    @Environment(\.scenePhase) private var scenePhase
    @State private var showingInvestments = false
    private let content: Content

    init(userID: UUID, client: VeyraAccountSyncClient,
         sessionProvider: @escaping () -> VeyraAccountSyncClient.Session?,
         @ViewBuilder content: () -> Content) {
        _store = StateObject(wrappedValue: VeyraInvestmentFavorites(
            userID: userID, client: client, sessionProvider: sessionProvider))
        self.content = content()
    }

    var body: some View {
        content
            .safeAreaInset(edge: .bottom, spacing: 0) {
                if store.allowed {
                    Button {
                        showingInvestments = true
                    } label: {
                        Label("Inversiones", systemImage: "chart.line.uptrend.xyaxis")
                            .frame(maxWidth: .infinity).padding(12)
                    }
                    .background(.regularMaterial)
                }
            }
            .sheet(isPresented: $showingInvestments) {
                VeyraInvestmentFavoritesView(store: store)
            }
            .task { await store.reload() }
            .onChange(of: scenePhase) { phase in
                if phase == .active {
                    Task { await store.reload() }
                } else if phase == .background {
                    showingInvestments = false
                    store.clear()
                }
            }
            .onDisappear {
                showingInvestments = false
                store.clear()
            }
    }
}
