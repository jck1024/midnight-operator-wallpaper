# Midnight Operator v1.0.0 — Build validation report

**Build date:** 22 November 2026. **Status:** Candidate release, awaiting the user's final Wallpaper Engine acceptance test.

## Passed offline checks

| Validation | Result | Method |
|---|---|---|
| JavaScript syntax | PASS | `node --check` on `script.js`, `audio-engine.js`, `city-effects.js` |
| Config validity | PASS | JSON parsed; entrypoint `index.html`; audio processing enabled in `general` |
| Native properties | PASS | All 32 v0.4 property definitions preserved, including combo labels/values |
| Asset completeness | PASS | HTML, CSS, JS, background and preview present; all local |
| Headless browser sizes | PASS | Chromium inline rendering at 1920×1080, 1650×927, 1366×768, 1280×720, 1024×768 |
| Panel clipping | PASS | Visible dashboard panel bounds stayed inside the viewport at each test size |
| Clock / calendar | PASS | Live formatted time and current month render |
| Audio callback | PASS | Mock Wallpaper Engine listener registers; injected audio produces nonzero spectrum pixels |
| Media title | PASS | Injected mock title and artist update Now Playing |
| Theme, layout, visibility | PASS | Blue theme, mirrored left layout and calendar toggle respond to property changes |
| Countdown | PASS | Future valid date appears after property callback |
| Eco / reduced motion / cinematic | PASS | Correct CSS/state flags in property tests |
| Pause and resume | PASS | Simulated `setPaused` toggles paused state |
| Quiet audio and silence | PASS | Node audio-engine unit test with PEAK ~0.03; bars decay to idle during silence |
| Runtime console errors | PASS | No JavaScript page errors seen in the five-size inline harness |

**Browser testing limitation:** Headless Chromium in this environment blocks direct `file://` loading. For tests only, the source HTML/CSS/JS and background were inlined into a single page via Playwright `set_content`. This executes the real source logic but is **not identical to running the extracted folder in Wallpaper Engine's Chromium host**.

## Not yet verified

- Actual Wallpaper Engine import, Spotify audio device capture and metadata on the user's PC.
- Sustained CPU, GPU, RAM, battery or temperature measurements; no percentage performance improvement claimed.
- Windows sleep/wake, fullscreen game/VirtualBox pause and native property persistence across Wallpaper Engine restarts.
- Uncommon monitor DPI/multi-monitor configurations and ultrawide screens.

These require the user's `ACCEPTANCE_CHECKLIST.md` tests. Keep v0.4 installed as fallback.
