# Native investment favorites integration

Status: prepared source, not shipped or compiled. This is a small native integration slice;
it does not replace the Veyra 1.2 web prototype or implement its complete investment UI.

## Included behavior

- Visible Inversiones access below the signed-in shell for server-authorized accounts.
- Entitlement checked on entering/foreground and before writes; database RLS remains authoritative.
- Favorite catalog: BTC, SOL, ETH, META, NKE, ADBE, PYPL, NU, Colombian Ecopetrol,
  US Ecopetrol ADR, and Terpel. These are catalog identifiers, not validated market-data feeds.
- Search within this catalog and favorites-only filter.
- Server-confirmed add/remove with revision checks and deletion tombstones.
- Uncertain writes and conflicts require a reload, never silent retries or overwrites.
- No credentials stored by this module. Session provider reads current Keychain session.
- Account identity boundary and generation checks discard obsolete network responses.
- Backgrounding clears screen data and dismisses the investment sheet.
- No changes to instructor/admin/student roles, existing study records, or IMSAFE data.

## Apply to the current native source

1. Confirm the actual latest iOS source before applying. Available reference was
   Veyra_Pilot_Intelligence_1_0_APP_STORE_BUILD_FIXED_10.zip; subsequent auth corrections
   must be preserved.
2. Add VeyraAccountSyncClient.swift and VeyraInvestmentFavoritesView.swift to the native target.
3. Apply native-investments.patch from the directory containing VeyraPlayground.swiftpm.
   It wraps only StudentShell, preserving the existing VeyraPlatformShell.
   Adapt the same wrapper manually if the latest shell differs.
4. Keep .id(student.id) and use the current authenticated session provider.
   Never authorize by preview-role selector, a client email list, or user metadata.
5. Build and run in Xcode/Swift Playgrounds. The integration requires the existing
   SwiftUI NavigationStack baseline (iOS 16+).

## Verification performed

- git apply --check passed against the available build-10 RootView.swift baseline.
- Referenced ProductionConfiguration, VeyraSessionStore, and authenticated identity
  members were inspected against that baseline.
- Backend isolation/revision tests are documented in account-sync-security-test.sql.

No Swift compiler or Xcode is available in this execution environment.
No native compilation, simulator, device, or cross-device favorite test has been performed.
Do not mark this ready for release until the following gate passes.

## Required device gate

- Authorized account: direct entry appears, add BTC, close/reopen, confirm favorite persists.
- Second device on same account: reload and confirm the same favorite.
- Concurrent changes: first write succeeds; stale second write shows conflict and reloads
  without overwriting newer data.
- Airplane mode during write: no success indication; reconnect/reload resolves uncertainty.
- Another student/admin without the separate feature grant: entry remains absent,
  and direct access/write is denied by server.
- Sign out/account switch while a request is pending: no old-account data in new session.
- Revoke feature while sheet is open: next reload/write denies access and clears records.
- Background/foreground and expired access token: data clears; expired session requests login.
- iPad and iPhone: entry does not cover existing tabs or original lesson content.

## Deliberately pending

- Current root auth flow refreshes sessions when restored. This slice does not add a second
  concurrent token refresh mechanism; on 401 it asks to sign in again.
- Offline durable outbox: this slice is online-first; there is no queued offline write.
- Arbitrary asset search, interactive native charts, quote provider integration,
  price monitoring and real push notifications are not implemented here.
- The second intended user has not registered. No account was created and no permission
  was assigned speculatively. Grant the separate feature only after their verified account exists.
- No medical reminders, student directory, or other 1.2 screens are wired by this patch.
