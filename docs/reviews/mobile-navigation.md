# Mobile navigation review — 2026-10-15

## Reported issue

The public home header displayed both the injected `.veyraMenuToggle` and the legacy `.mobileNavMenu` details/summary control. Each opened a different panel, and both panels could remain open simultaneously.

## Change scope

Only `assets/js/veyra-en-operacion.js` changes at runtime. The enhanced header now has one control and uses the existing `.premiumNav` routes without cloning or replacing their handlers. The legacy native details menu remains a fallback until enhancement is installed, then is closed and hidden, including from keyboard navigation.

The panel has an opaque background, viewport-aware maximum height and internal scrolling. All eight options remain available at tablet widths. Touch targets are at least 44 px. The header remains visible while its menu is open, without changing the existing hide-on-scroll behavior when closed.

The menu closes on option selection, logo selection, outside click, Escape, focus leaving the header, desktop breakpoint transition, and page restoration. Escape returns focus to the toggle. `aria-controls`, `aria-expanded`, accessible labels, and repeat-initialization guards are retained or added.

The hero, classes, Training Center content, A320 LANZAMIENTO badge, showcase iframe, FAQ ordering, authentication and assessment logic are not redesigned or changed.

## Verification before merge

Reproduced the original two-menu problem using the exact GitHub Pages artifact from main commit `990786ead166334db95a0d6639e7bd46daa15be6`, run `38682151258`. The original JavaScript blob matched repository SHA `ea287294289e5382221d28254441fb0564db131f`.

The patched script passed `node --check`. Offline Chromium/Playwright integration checks used the deployed HTML, its original inline application logic, and the patched script. Network requests were blocked; no student-data, assessment, authentication or production-write endpoints were called.

Passed viewports: 320×568, 375×667, 390×700, 430×780, 844×390 (landscape), 768×1024, 1024×768, 1180×800, 1181×800 and 1440×900.

Checks included: a single visible mobile controller; no legacy panel; eight accessible options; panel containment within the viewport; reachable last option on short screens; original Training Center and Inicio handlers; outside-click, logo and Escape closing; focus return; open-header visibility; desktop/mobile resize; and repeated script initialization without duplicated controls or listeners. The tested pages produced no JavaScript page errors. Mobile open/closed and landscape screenshots were inspected.

These are responsive Chromium checks, not a claim of testing on a physical iPhone, Safari or Instagram's embedded browser. Final publication additionally requires green PR checks, merge to main, successful GitHub Pages deployment and verification of the published asset.
