# Veyra 1.2 account synchronization foundation

Status: backend deployed and SQL-tested; Swift transport prepared, NOT wired into the released iOS application.

## Verified environment
The inspected App Store source uses Supabase project ogdncxrhdnnpphvuhvpf (named Veyra Mobile Staging). The owner's existing account already has active student, instructor and admin roles. Roles were not changed. Manager is a UI label for the existing administrator capability, not a new global role.

Migration 20261026084704 was applied through Supabase on 2026-10-26. Existing tables and user records were not modified. A separate investments entitlement was granted to the owner's verified account out-of-band; no email or account UUID is committed here. Oscar has not been granted access.

## Contract
- veyra_feature_access: authenticated users can read only their own grants; only trusted backend administration can write them.
- veyra_sync_records: each row belongs to one authenticated account; owner-only RLS, including for administrators. Investment collections also require the active investments entitlement.
- Allowed collections: Academy favorites, learning progress, flight log, pilot profile, study plan, medical reminders, investment favorites, price rules.
- Canonical flight duration is integer seconds in the payload. Payloads must be JSON objects, at most 64 KiB.
- Medical/profile data are private; this store does not expose health information in the manager directory.
- RPC veyra_sync_write creates at expected revision zero or updates only the exact expected revision. Revisions and timestamps are server-managed. A stale write raises 40001; no silent overwrite.
- Deletion is a tombstone, not a physical DELETE. Clients must process deleted rows.
- Records here do not grant operational/medical approval and cannot grant account roles.
- Price rules are storage only; no market monitor or APNs delivery is provisioned by this change.

## Native integration still required
1. Add VeyraAccountSyncClient.swift to the Swift application, using existing ProductionConfiguration and the authenticated account's current access token.
2. Derive visible roles from server-authorized user_roles and investments from features(), never from a design selector or user-editable profile metadata.
3. Implement per-user persistent outbox and typed payloads. Preserve local records until the server acknowledges each write. UUID/record IDs must remain stable on retry.
4. Do not upload unowned browser-demo data automatically. Offer explicit import with a preview once ownership is confirmed.
5. On login/logout/account switch, cancel old work, separate local namespaces, and discard responses from a previous user.
6. On 401 refresh the session using the existing auth flow; on 403 retain local data and report access loss. On conflict fetch both versions and reconcile explicitly. A lost write response may be reconciled only after comparing the server payload and revision.
7. Read all pages including tombstones. Offset scans are baseline support, not a changefeed; repeat reconciliation after concurrent activity. Design stable snapshot/cursor fetching before relying on large datasets.
8. Integrate the approved 1.2 views and run the actual iOS build in Xcode/Swift Playgrounds. No Swift compiler is available in this workspace; this transport has not been compiled.
9. Verify two devices, offline edits, reconnect, conflicting edits, logout, revoked entitlement, pagination and tombstone replay before TestFlight.

## Validation completed
Rollback-only SQL checks passed: create/update revisions, stale update rejection, tombstone updates, authorized investment write, blocked self-grant, cross-user isolation, unauthorized investment write, anonymous table/RPC denial. Test data were rolled back.
Security advisor reported no finding on the new tables/functions. Existing unrelated findings remain: private deny-all tables without policies, an authenticated institutional-benefit SECURITY DEFINER function, and disabled leaked-password protection. These were not changed in this scope.
References:
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
