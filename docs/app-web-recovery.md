# App password recovery in the browser

Prepared 2026-10-05. Activation pending; this branch is not deployed.

The iOS recovery button will open `https://veyrapilot.com/recuperar-app.html`.
This standalone page uses the same public Supabase project as the mobile app.
It requests a recovery email, accepts a recovery session in the URL fragment,
validates the session with Auth, and lets the user save a new password.
The user then returns manually to the app to sign in.

## Activation gate

1. In the mobile project's Auth URL Configuration, add exactly
   `https://veyrapilot.com/recuperar-app.html` to Redirect URLs. Preserve all
   existing URLs and the Site URL. Do not edit the other project's auth settings.
2. Inspect Reset Password email template to ensure the confirmation link
   honors the requested redirect. Existing logs show the native recovery
   redirect was honored; current dashboard configuration must be checked.
3. Deploy the three new web assets to the existing GitHub Pages site.
4. Verify HTTPS responses and an actual recovery using a tester-owned account.
   Do not send emails or change account passwords through automated test scripts.
5. Only after web validation, compile and test the separate iOS candidate.
   Version remains 1.0.0; proposed build 3 must be checked for availability.

No App Review submission or app publication is part of this deployment.
Account deletion is a separate review requirement and is unchanged.

## Security and behavior

- Only the existing public publishable key; no admin credentials.
- Only Supabase Auth endpoints, without database or role changes.
- Fixed HTTPS redirect; no user-controlled redirect destinations.
- Tokens removed from URL immediately, retained in memory only, and cleared
  after success/page exit. Reload requires a fresh recovery link.
- Password fields cleared after success; best-effort local recovery-session logout.
- No analytics, external scripts, third-party fonts, or persisted browser session.
- No account existence disclosure in successful recovery request responses.
- Backend rate limits remain authoritative; client shows a resend cooldown.
- Link expiry, invalid sessions, password mismatch and server errors are handled.

## Verification performed

`node --check recuperar-app.js`

`node tests/app-web-recovery.cjs` with Playwright available on Node's module path.
The test can use `VEYRA_TEST_CHROMIUM` to select an installed Chromium executable.
It intercepts every Auth request; no real emails or credentials are used.

Covered: fixed request destination, generic account message, resend cooldown,
malformed and expired links, missing session, password mismatch, weak password,
successful update, token removal, no persisted session, page reload and 429.
Mobile and tablet screenshots were inspected. Physical Safari/end-to-end email
verification is still pending.

References:
- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/auth/redirect-urls
