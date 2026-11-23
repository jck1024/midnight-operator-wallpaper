MIDNIGHT OPERATOR v0.2.0 — Motion & Audio Repair
===============================================

A separate, complete Wallpaper Engine WEB wallpaper project for Windows.
This ZIP does not modify or require Midnight Operator v0.1.

INSTALL WITHOUT OVERWRITING v0.1
---------------------------------
1. Leave v0.1 installed as your fallback.
2. Extract THIS ZIP to a new folder, for example:
   Documents\WallpaperProjects\MidnightOperator_v0.2\
3. Open Wallpaper Engine on Windows > Wallpaper Editor / Create Wallpaper.
4. Drag the extracted v0.2 INDEX.HTML onto Create Wallpaper.
   DO NOT import the ZIP or preview JPG. Do not drag an older v0.1 file.
5. Use a DIFFERENT title: "Midnight Operator v0.2 - Motion & Audio Repair".
6. Save in the editor, return to Installed, and apply the new wallpaper.
7. Keep v0.1 available as a rollback; switch wallpapers if needed.

WHAT CHANGED SINCE v0.1
-----------------------
- Correct audio capture declaration: general.supportsaudioprocessing = true.
- Kept immediate Wallpaper Engine audio listener registration.
- Responsive REAL audio spectrum with adjustable sensitivity (no fake audio).
- Optional true-state diagnostics for CALLBACKS / PEAK / LAST audio sample.
- More visible foreground rainfall, fog drift, neon pulse and rail light motion.
- Larger clock, Now Playing cover/text/spectrum, calendar labels and dates.
- Dashboard scale from 90%-120%; default 108%.
- Wallpaper Engine FPS limit honoured, capped at 30 FPS; capped rain particles.
- Reduced Motion now disables rain, camera drift, rail movement and neon pulse.
- Improved matching of CSS and canvas pause behaviour.

CUSTOMISE
---------
Select the v0.2 wallpaper > Properties:
  Rain animation, Rain intensity (0-100)
  Dashboard / cinematic, Show calendar, Show workspace, Show Now Playing
  Key dashboard text / artwork size (90%-120%)
  Audio visualiser sensitivity (25%-200%)
  Scanlines, Reduced motion, Show diagnostics
  Optional countdown date (YYYY-MM-DD) and label

AUDIO TEST — SPOTIFY
--------------------
1. Play music via Spotify. Confirm song title/artwork are visible.
2. Enable "Show diagnostics" in wallpaper Properties.
3. In diagnostic overlay, check AUDIO:
    ACTIVE   = real non-zero audio samples received; spectrum should move.
    QUIET    = audio callbacks are arriving, but current peak is near zero.
    WAITING  = audio listener registered, no recent samples arrived.
    UNAVAILABLE = Wallpaper Engine audio API not registered, e.g. browser preview.
4. If WAITING persists while Spotify is audibly playing:
   a) In Wallpaper Engine, check the audio recording/output device settings.
   b) Try another known-working audio-reactive Wallpaper Engine wallpaper.
   c) In the editor Save the project; close and relaunch its wallpaper.
   d) Editor > Edit > Open in Explorer > project.json:
      confirm the "general" object includes "supportsaudioprocessing": true.
5. If ACTIVE but bars look small, raise Audio visualiser sensitivity.
6. Turn diagnostics OFF after testing.

Audio spectrum and media track metadata are INDEPENDENT. A correct song title
is not proof that Wallpaper Engine has sent sound samples. This wallpaper
cannot receive Windows system audio inside a regular browser preview.

PERFORMANCE / BATTERY
---------------------
Test at 15 or 30 FPS in Wallpaper Engine Settings > Performance.
Use Other application fullscreen: Stop (free memory) for demanding games.
Consider Pause or Stop on battery; keep existing settings if they work well.
An integrated-GPU laptop should be evaluated with Task Manager for real
CPU / GPU / RAM changes versus v0.1. Results depend on the device.

ANIMATION NOTE
--------------
The city/desk is one static image. Only rain, glow/fog, camera drift and train
lights are animated overlays. The train lights are a stylised overlay and may
not match every pixel of the distant train in the background artwork.

DATA / PRIVACY
--------------
Offline and local. No external JavaScript, trackers, web services or ads.
The project names are decorative. It does not read CPU, RAM, security logs,
GitHub or personal files. Media metadata is from Wallpaper Engine only.

TESTING STATUS
--------------
- JavaScript/JSON syntax and browser preview were checked in an offline
  Chromium test harness using STUBBED audio and media callbacks.
- Tested at 1920x1080, 1650x927, 1366x768, 1280x720, 1024x768.
- Actual Spotify capture, Windows media integration and Wallpaper Engine
  performance remain UNVERIFIED until you test on your own machine.
- See TESTING_CHECKLIST.txt for acceptance tests.

OFFICIAL WALLPAPER ENGINE DOCUMENTATION
---------------------------------------
Import: https://docs.wallpaperengine.io/en/web/first/gettingstarted.html
Audio: https://docs.wallpaperengine.io/en/web/audio/visualizer.html
Media: https://docs.wallpaperengine.io/en/web/audio/media.html
FPS: https://docs.wallpaperengine.io/en/web/performance/fps.html
