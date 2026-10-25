# Mobile signup confirmation

Prepared 2026-10-25. Activation is pending inspection of the current Supabase email template.

Published iOS build 1.0.0 (2) uses `veyra://auth/confirmed` for signup and resend.
Its callback displays a small English success message, while the browser can
remain blank. The new web page confirms the account visibly in Spanish before
the user deliberately returns to the existing app. No new native build required
for this email-template solution. Improving the native message remains a future
app change.

## Activation order

1. Deploy confirmar-cuenta.html, .css and .js on veyrapilot.com and verify HTTPS.
2. Inspect and preserve the existing Confirm sign up template of mobile project
   ogdncxrhdnnpphvuhvpf (Veyra Mobile Staging). Save its original for rollback.
3. Replace only the mobile confirmation link destination using the conditional
   below. Keep existing branding and non-mobile signup destinations unchanged.
   Do not edit Site URL, redirect allowlist, recovery templates, roles or data.
4. Subject may be translated to `Confirma tu correo en Veyra` after inspecting
   the existing subject. In the mobile instructions explain that the webpage
   will show confirmation and then offer a button to open Veyra.
5. User must test a newly requested email on a physical iPhone, verifying
   successful confirmation and subsequent sign-in, plus reused-link handling.
   Previously sent emails cannot be changed retrospectively.

Proposed href (Supabase Go template, only the existing mobile redirect):

```
{{ if eq .RedirectTo "veyra://auth/confirmed" }}https://veyrapilot.com/confirmar-cuenta.html#token_hash={{ .TokenHash }}{{ else }}{{ .ConfirmationURL }}{{ end }}
```

The user explicitly presses Confirmar mi correo to avoid consuming tokens in
email scanner previews. POST /auth/v1/verify uses type=email and token_hash,
as documented by Supabase verifyOtp. Success requires an OK response with
user.email_confirmed_at. Errors, missing or reused tokens never show success.
Only the public publishable key is used. No account creation, user enumeration,
database changes, password entry, analytics, third-party scripts, or persisted
session. Fragment is removed immediately. Temporary verification session is
logged out with scope=local; app sessions are not revoked. The app deep link
contains no token. Reload requires reopening the email; no query-based success.

Run `node tests/app-email-confirmation.cjs`. Tests simulate Auth responses and
must never send live signup or confirmation requests.

References:
- https://supabase.com/docs/guides/auth/auth-email-templates
- https://supabase.com/docs/reference/javascript/auth-verifyotp
