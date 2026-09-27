# ETOPS visual 2.0

27 September 2026. Presentation redesign requested after the first edition proved too text-heavy.

## What changed

The public ETOPS index now loads `visual.css` and `visual.js`. The old text-first runtime is no longer loaded. Each topic opens with a large explanatory SVG graphic, a short instruction and an interaction. The first eight topics have a one-question comprehension check; the ninth is a three-step decision mission; the tenth opens the existing twenty-question practice bank.

The route includes a moving aircraft/time reference, threshold versus authorized maximum, expanding diversion circles and an ETP indicator, a runway/weather availability scene, fuel-comparison bars, keyboard-accessible aircraft/system hotspots, an EEP verification sequence and diversion options that respond to airport availability.

Long reading is behind **Ver explicación**. Existing detailed source notes and corrections remain available in a separate modal. The PDFs, PPTX, `content.js` and `quiz.js` are unchanged. This is a presentation update, not a new regulatory review or operational approval. Numerical examples remain explicitly fictitious.

## Privacy and continuity

The existing local storage key is retained. Valid notes, reviewed modules and quiz attempts from the first edition are preserved. No account, Supabase, role, email or real training-record changes are involved. Next marks the topic as reviewed, not as proficiency achieved. Denied storage does not block study.

## A320 launch label

The existing main-page presentation script adds one accessible text badge, **LANZAMIENTO**, to the A320 Foundations Training Center card. The matching uses its title, not a grid index. Installation is idempotent. The A320 course/link and Classes NUEVO badge are unchanged. No A320 course files were edited.

## Verification actually performed

144 successful offline Chromium assertions: 128 classroom/function/layout checks and 16 targeted checks. Covered all ten topic routes; eight checkpoints; controls and calculated outputs; mission completion; both quiz feedback modes; twenty-question scoring; saved-state restoration; escaped notes; rejected malformed quiz state; denied storage; mobile map/glossary; SVG click and keyboard activation; and no horizontal overflow at widths 390, 834 and 1024 pixels.

The A320 badge was checked on an isolated DOM fixture using the exact added selector/creation/CSS logic, including idempotency, unchanged course link and no change to the Classes badge. This is not a claim of testing the entire live main page.

Node syntax checks passed. The repository blob hashes of `visual.js`, `visual.css` and `index.html` matched the files used in the local browser. Tests ran with an in-memory document and test storage because network navigation was unavailable. Physical Safari/iPad and live-domain rendering were not tested in that harness.

The v1 README describes the earlier edition; this document records the v2 presentation and its own verification scope.
