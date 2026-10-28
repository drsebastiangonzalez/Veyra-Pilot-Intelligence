# Price alert evaluator

Pure JavaScript module for a future server worker. No third-party dependencies.
Not deployed, scheduled, connected to a quote feed, or sending notifications.

Run: `node --test app-integration/veyra-1.2/alerts/price-alert-engine.test.mjs`

Nine tests passed locally: upward/equality crossing, downward/one-shot, repeat/cooldown,
freshness and currency isolation, identity/revision isolation, independent thresholds,
deterministic event IDs, decimal precision, paused/invalid rules.

## User-visible semantics

- Multiple independent rules can watch the same instrument.
- Above means crossing from strictly below to at/above the target; below is the inverse.
- First observation sets a baseline, even if already beyond target. No immediate alert.
- Repeated alerts require first returning to the opposite side.
- Crossings during cooldown are suppressed, not delayed for later delivery.
- One-shot rules complete after the first event.
- Editing a rule starts a fresh baseline. Reactivation must increment revision.
- Rule and quote currency must match. Ecopetrol COP and its USD ADR are distinct instruments.
- Prices are positive decimal strings (up to 12 fractional digits), never formatted numbers.
- Only observed crossings can trigger; movements between polling samples can be missed.

## Required worker contract

1. Load rules server-side and re-check the owner's enabled investments entitlement.
   Do not trust UI roles, client email lists, or client-provided authorization.
2. Map instrument IDs to a licensed provider with explicit currency, timestamp, and source.
   Do not substitute the time of fetch for the actual quote timestamp.
3. Pass server time and provider-appropriate freshness policy. Default age limit is 60 seconds;
   delayed feeds require an explicit policy and must be identified as delayed in the UI.
4. Load previous evaluator state scoped to owner/rule. Rule identity includes revision and settings.
5. Evaluate; atomically compare-and-swap state and insert returned event into a durable delivery
   outbox with a unique constraint on event.key. A deterministic key alone is NOT delivery deduplication.
6. On concurrent state conflict, reload before evaluating again.
7. Before sending, re-check owner entitlement and device binding. Deliver via APNs with retries
   and delivery bookkeeping; avoid resending already acknowledged events.
8. Update state only after the transaction succeeds. Never persist credentials in evaluator state.

Existing price_rules sync records are user drafts. A worker adapter must validate them, derive
userId/id/revision from server-owned record columns and exclude tombstones before evaluating.
No service-role key or APNs credential belongs in the app or this module.

Pending: quote-provider selection/coverage, rule editor wiring, validated database adapter,
atomic event outbox migration, worker scheduling, device-token registration, APNs delivery,
and device/background/end-to-end testing. No alert has been activated for either intended user.
