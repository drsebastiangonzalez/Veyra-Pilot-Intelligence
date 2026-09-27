# ETOPS · Tiempo para decidir

Version 1.0.0 — 26 September 2026.

Independent introductory class at `/classes/etops/`, reached through the existing Training Center → Classes card. No dependency on A320 Foundations, Supabase, enterprise login or real training records.

## Supplied basis

- `modulo-etops.pdf`: 17-page introductory module.
- `Veyra_Modulo_ETOPS.pptx`: 20-slide presentation.
- `etops-quiz.pdf`: 20 questions; one at a time, immediate feedback and a suggested 16/20 formative reference.

The original files are not silently altered or republished as corrected operational manuals. Lesson references identify source sections/slides. The Sources and Technical Review view contains 15 explicit adaptation/correction entries and primary references.

## Learning experience

Ten lessons with objectives, substantive reading, eight concept labs, one three-stage decision mission, nine module checkpoints, a 16-entry searchable glossary and local notes. The 20-item revised bank has Learn (immediate feedback) and Check (feedback on completion) modes, shuffled questions/options, stable answer IDs, resumable attempts and module-specific review suggestions.

The numerical labs use fictional aerodromes and supplied assumptions. They are not dispatch/performance/route-approval calculators. The 80% reference is formative, not regulatory. Answers are client-side and this is NOT a protected official examination.

## Technical corrections and scope

The detailed external contrast uses the linked FAA sections: 1.1; 121.161; Appendix P; 121.624; 121.631; 121.633; 121.646; 121.374; 121.565; 21.4. Important distinctions include ETP vs most critical fuel point, comparing all three fuel cases, safe altitude rather than universal FL100, dispatch vs EEP criteria, scoped time-limited-system checks, dual maintenance, and world-fleet vs operator IFSD criteria.

The EASA landing page was checked, but the full current EASA/OACI texts and the operator's manuals, MEL, AFM, CMP and OpSpecs were not supplied or fully verified. Do not claim operator approval, full regulatory validation, or universal applicability to aircraft variants. A320 remains an application case only. Responsible instruction review is required before use in an approved program.

## Runtime and privacy

- Plain HTML/CSS/JavaScript. Deferred scripts load in order: content, quiz, runtime.
- One runtime closure; no cross-scope Auth/App dependencies.
- Storage key: `veyra.classes.etops.v1` only. No synchronization, API requests, account mapping or real crew data.
- Users can clear only this class's local progress; denied storage does not block study.
- Notes are escaped before rendering. Storage data is validated.
- Module review marking is manual, not evidence of proficiency or certification.

## Verification performed

83 passing assertions in a Chromium offline browser harness on 26 September 2026: all ten lesson routes, checkpoint feedback, progress, distance/ETP values, phase/weather controls, fuel winners, diversion availability, mission completion, 20-question scoring and review, both feedback modes, state restoration on reinitialization, escaped notes, glossary, revision log, and no horizontal overflow at 834px and 390px for all modules. JavaScript syntax checked with Node.

The harness loaded the actual files into an in-memory document and used test storage because network navigation was restricted in the execution environment. It did not log into a user account, send email or test a physical iPad/Safari. Repository blob hashes were compared with the tested files. These are functional/UI checks, not aviation certification or a claim of exhaustive security review.
