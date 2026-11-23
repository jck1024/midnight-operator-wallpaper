# MIDNIGHT OPERATOR v1.0.0 — STABLE RELEASE

Wallpaper Engine Web wallpaper (HTML/CSS/JavaScript). The **v0.4 visual design and supported features are intentionally retained**. v1.0 is a release-quality milestone, not a new city scene or an expansion of the HUD.

## Installation (Windows / Steam Wallpaper Engine)

1. **Keep v0.4 installed as a rollback copy.** Do not overwrite its folder or existing wallpaper.
2. Extract `Midnight_Operator_v1.0_RELEASE.zip` into a **new** folder.
3. Start Wallpaper Engine and open **Wallpaper Editor / Create Wallpaper**.
4. Drag **this folder's `index.html`** onto Create Wallpaper. Wallpaper Engine imports the web project and its local assets.
5. Save under a distinct name: **Midnight Operator v1.0 — Stable Release**.
6. In the Installed list, select v1.0 and open Properties to configure it.
7. Test the wallpaper using `ACCEPTANCE_CHECKLIST.md` before deciding to retire v0.4.

**Do not import the ZIP or `preview.jpg` as the wallpaper**; import `index.html`. Keep `index.html`, `project.json`, `style.css`, the JavaScript files and `assets/` together.

## Changes since v0.4

- **Lower clock-formatting overhead:** create and reuse London, Hong Kong, and date formatters rather than reconstructing them every second.
- **Less repeated canvas allocation:** changing colour/audio/lighting properties no longer reallocates the full-screen rain and city canvases; canvas resizes occur on changes that require them, such as Eco/Balanced profile or screen dimensions.
- **Skip inactive drawing:** rain, city and spectrum canvases avoid unnecessary drawing when their layers are disabled, HUD is hidden, or Reduced Motion is active; cache spectrum dimensions until relevant layout changes.
- **Packaging and documentation:** clean self-contained files, changelog, release acceptance checklist and integrity hashes.
- **No new experimental features:** v0.4 themes, presets, Spotify/audio, countdown, clocks, calendar, live city, Eco mode and diagnostics remain.

These are targeted code optimisations, **not a verified claim of specific CPU/GPU/RAM savings**. Monitor the result on your own laptop; Wallpaper Engine's built-in battery, fullscreen and pause policies are still important.

## Feature summary

- City: animated rain, haze, window lighting, neon signs, rail traffic, distant lights and wet reflections.
- Widgets: London/Hong Kong clocks with daylight saving accounted for; UK monthly calendar; configurable countdown; music track title, artist, album art and real audio-reactive bars; workspace labels.
- Customisation: three HUD colours (Purple, Green, Blue), three dashboard layouts (right, left, compact), width and text scale, individual widget toggles, lighting and rain controls.
- Presets: Custom, Night Shift, Focus, Cinematic and Original Appearance.
- Performance: Balanced (up to 30 FPS), Eco (up to 15 FPS), Reduced Motion, and obey Wallpaper Engine's general FPS cap.
- Diagnostics: optional real audio and motion state indicator.

All assets are local. There are no third-party scripts, sign-in prompts, analytics or external network requests in the shipped wallpaper code.

## Suggested first-run configuration

Choose **Custom controls**, **Cyberpunk Purple**, **Right / classic**, **Dashboard width 100%**, **Balanced** and your preferred Rain/City Activity levels. This is closest to the accepted v0.4 default. Use **Eco** during extended work if lower animation load is preferred.

**Countdown:** Under Properties, enable `Show countdown`, enter a future date in `YYYY-MM-DD`, and set its label. Without a valid date it stays hidden. Separate Wallpaper Engine imports do not automatically transfer custom settings from v0.4; re-enter the date and any preferred controls.

**Spotify bars:** Wallpaper Engine's audio-recording system must be enabled. Track metadata and audio capture use different Windows integrations. A detected song title does *not* establish that audio samples are arriving. Show diagnostics and look for ACTIVE plus rising callback count. If WAITING, check Wallpaper Engine > Settings > General > Media > Audio recording device and Windows output device.

**Presets:** When using a preset other than Custom, the preset overrides some individual controls. `Restore original appearance` changes the appearance; it is **not a settings eraser**.

**Themes:** Only HUD elements change hue; the baked-in city artwork remains purple.

## Troubleshooting / rollback

- Missing city artwork: verify `assets/night_city.jpg` was imported together with `index.html`.
- Static visualiser: check the audio device, Wallpaper Engine media/audio settings and optional diagnostics.
- Missing countdown: add a valid date and enable the countdown and HUD.
- UI scaling/overlap: try Right/classic and 100% width, lower text scale, or Compact Right.
- High resource usage: select Eco; allow Wallpaper Engine to pause/stop for fullscreen apps and on battery.
- Unexpected appearance or functionality: select your untouched **Midnight Operator v0.4** from Installed while investigating.

## Tested / not tested

Verified in this build environment: JavaScript syntax, configuration structure, 5-size browser rendering using an offline inline harness, mock Wallpaper Engine properties/media/audio input, real clock/calendar rendering and basic layout bounds. **Not tested in the user's installed Wallpaper Engine**: real Spotify capture, actual CPU/GPU/RAM/thermal behaviour, sustained run time, sleep/wake and built-in fullscreen/battery integration. Please complete `ACCEPTANCE_CHECKLIST.md`.

## Release contents

- `index.html` — Wallpaper Engine entry point
- `project.json` — project settings and Wallpaper Engine properties
- `style.css` — layout and motion design
- `script.js` — dashboard, date/time, rain, media callbacks and render loop
- `audio-engine.js` — adaptive audio spectrum
- `city-effects.js` — animated city and reflections
- `assets/night_city.jpg` — local city backdrop
- `preview.jpg` — preview image
- `README.md`, `CHANGELOG.md`, `ACCEPTANCE_CHECKLIST.md`, `TEST_REPORT.md`, `SHA256SUMS.txt`

Release is packaged as an independent version. This is a local personal wallpaper project, not a Workshop submission or installer.
