# Quote adapter status — 2026-10-26

Implemented Coinbase Exchange last-trade adapter for BTC-USD, SOL-USD and ETH-USD.
Normalizes into the price crossing evaluator's format. No orders, wallets or exchange-account credentials.

Verification:
- 17 Node tests passed across engine and adapter, including their integration.
- Live HTTP requests using curl succeeded for all three pairs. Their actual JSON responses
  passed normalizeCoinbaseTicker with USD currency and source ages of 13–14 seconds.
- Injected-fetch tests cover URL mapping, timestamp preservation, stale/future rejection,
  malformed prices/JSON, HTTP 429, timeout, and partial snapshot failures.
- Actual production-runtime fetch remains to be verified when deploying the worker.
- Source nanoseconds are retained in sourceTime; evaluation uses millisecond precision.
- No live prices are committed as fixtures or presented as permanent current quotes.

Source: https://docs.cdp.coinbase.com/api-reference/exchange-api/rest-api/products/get-product-ticker

Scope:
- This adapter is code in the integration branch, not a running quote service.
- Existing iOS favorite IDs BTC/SOL/ETH must map through the adapter to the engine's
  BTC-USD/SOL-USD/ETH-USD instrument IDs; do not mix them implicitly.
- Fixed public host and allowlisted instruments; no user-supplied URL.
- Last trade is not a consolidated price or guaranteed execution price.
- No automatic retries; the future scheduler must honor backoff.
- Coinbase data terms and production usage limits must be respected.
- Previous requirements for atomic state/outbox and server entitlement checks still apply.

Equities:
- US equities feed and credentials are not selected or connected.
- Twelve Data XBOG coverage page labels Colombian coverage EOD (end of day), not intraday.
  https://twelvedata.com/exchanges/xbog?group=core
- This is insufficient for the requested intraday threshold notifications.
- Terpel symbol/coverage and a suitable licensed intraday Colombian feed remain unverified.
- No paid subscription was created. Do not present US ADR prices as Colombian local shares.

Push delivery inspection:
- No APNs registration/capability markers were found in the available build-10 Swift source.
- Listed functions in the mobile Supabase project contain no investment/push worker.
- This does not prove that no APNs key exists in the Apple account; that has not been inspected.
- Obtain the current native project before applying modifications, preserving subsequent auth fixes.
- Configure Push Notifications capability and current provisioning, register devices, bind tokens
  to authenticated accounts with server checks, then configure APNs server authentication.
- Keep .p8 signing keys in the server secret store, never in source, app bundle or chat.
- Apple references:
  https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns
  https://developer.apple.com/documentation/usernotifications/establishing-a-token-based-connection-to-apns
  https://developer.apple.com/documentation/usernotifications/sending-notification-requests-to-apns

Still no scheduled polling or APNs messages. Next deployment requires durable worker state,
transactional event outbox, current native integration and device validation.
