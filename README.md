# Midnight Operator v0.4.0 — Personalisation & Polish

A self-contained **Wallpaper Engine Web wallpaper**. Based on your accepted v0.3 (Living City) source. The same city artwork, clock/calendar, Spotify media metadata and audio spectrum, countdown, rain, reflections, moving rail lights and city atmosphere are retained.

## Install as a separate Wallpaper Engine project (Windows)

1. Extract the entire ZIP into a new folder. Do **not** replace your existing v0.3 or v0.2.1 folders.
2. Open **Wallpaper Engine → Wallpaper Editor / Create Wallpaper**.
3. Drag this v0.4 folder's **index.html** onto **Create Wallpaper**, or use the editor's web-wallpaper import path.
4. Save the project with a distinct name such as **Midnight Operator v0.4 — Personalisation & Polish**.
5. Return to **Installed**, select v0.4 and open **Properties** to adjust it.
6. Keep v0.3 installed as the tested fallback.

The HTML, CSS, JavaScript and local artwork MUST remain together. Do not import preview.jpg or the ZIP as an image wallpaper. The project has no remote dependencies or external data requests.

## New controls in Properties

### Display preset

- **Custom controls** (default): all individual visibility, lighting and activity controls apply directly; this preserves the accepted v0.3 look.
- **Night Shift**: full dashboard and stronger ambient city lighting.
- **Focus**: clock/calendar visible; hides music, workspace, title and footer; dims animation levels.
- **Cinematic**: hides dashboard/overlays while keeping the city background animated.
- **Restore original appearance**: returns the *on-screen appearance* to the v0.3-style default. **Important:** this is a temporary display override, not a command to erase saved Wallpaper Engine settings. Switch back to Custom to reuse your saved individual controls.

**When a non-Custom preset is selected, it overrides some individual controls.** Choose **Custom controls** to make every toggle/slider authoritative. The colour theme and performance profile still apply in Night Shift, Focus, and Cinematic, except original appearance resets the HUD theme to purple for the display only.

### Colours and layout

- **HUD colour theme:** Cyberpunk Purple, Matrix Green, Midnight Blue. This recolours the dashboard, titles, borders, countdown and audio bars. The **underlying city art remains purple** by design.
- **Dashboard layout:** Right/classic, Left/mirrored, or Compact right.
- **Dashboard width:** 85–115%; dashboard text/artwork size remains separately adjustable via the original `Key dashboard text / artwork size` slider.
- **City artwork brightness:** 65–125%. Does not adjust the Windows display backlight.
- **Neon atmosphere intensity:** 0–160%; affects the ambient neon-bloom overlay, not the original baked-in neon artwork or the physical screen brightness.

### Widget visibility

Toggle World Clock, Now Playing, Calendar, Workspace, wallpaper title, footer captions and countdown separately. The existing top-level **Dashboard/cinematic mode** switch still hides the whole HUD. To show the countdown, set a valid `YYYY-MM-DD` future date and leave its visibility enabled.

### Performance

- **Balanced:** animation frame-rate cap of 30 FPS, respecting any lower Wallpaper Engine FPS setting.
- **Eco:** animation cap of 15 FPS, fewer rain particles and less city-overlay activity; with device-pixel ratio capped at 1 for canvas. Does not change Wallpaper Engine's built-in pause-on-fullscreen or battery policy; those settings still apply.
- **Reduced Motion:** disables animated effects, including the city layer, whenever enabled.

The v0.3 Spotify quiet-input normalisation, separate sensitivity, bar intensity and bass controls are unchanged. The bars reflect **real Wallpaper Engine audio capture**; they do not play a synthetic demo. Spotify metadata and audio input are independent.

## Resetting and backing up

- For an on-screen v0.3 look, choose **Restore original appearance** under Display preset.
- For real property resets, use Wallpaper Engine's own per-wallpaper reset controls (if present in your installed UI), or re-import a fresh copy under a new wallpaper name. The preset does **not** erase your settings.
- You may need to re-enter your countdown date/label because v0.4 is a separate wallpaper.
- Leave v0.3 installed until v0.4 passes the release checklist.

## Diagnostics

Enable **Show diagnostics** in Properties to inspect audio callback activity, PEAK, auto-gain, city state, motion state and FPS. Disable it for normal use.

## Testing and limitations

The project passed static JSON/JavaScript validation and 64 **offline, mocked integration assertions**, including simulated Wallpaper Engine callback/property changes. These tests are **not** a replacement for a live rendering and performance run. Chromium navigation was blocked by this build environment, so v0.4 has **not** been visually verified in a real browser or Wallpaper Engine, and the new dropdown controls and layouts require your laptop acceptance test.

See `TESTING_CHECKLIST.txt` for recommended acceptance tests, and `CHANGELOG.txt` for the full differences from v0.3.
