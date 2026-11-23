MIDNIGHT OPERATOR v0.3.0 — LIVING CITY
========================================
This is a complete, self-contained Wallpaper Engine WEB wallpaper.
Built from the verified v0.2.1 project. Keep v0.2.1 installed as your rollback.

INSTALL (Windows + Wallpaper Engine)
------------------------------------
1. Extract the ZIP into a NEW folder. Keep every file and the assets folder together.
2. In Wallpaper Engine, open the wallpaper editor (Create Wallpaper).
3. Drag the included index.html onto Create Wallpaper.
4. Save under the distinct name "Midnight Operator v0.3 — Living City".
5. Select it in the Installed library and apply it.
6. Open Wallpaper Properties and set your choices (new version does NOT
   automatically carry over the countdown date or previous slider values).
7. Keep v0.2.1 untouched until v0.3 passes the included acceptance tests.

NEW SETTINGS IN WALLPAPER PROPERTIES
-----------------------------------
Living city effects: turns off the entire extra city layer when disabled.
City activity / brightness: 0–100% strength; start at 70%.
Animated neon signs: two small cyberpunk signs, flickering subtly.
Elevated traffic and distant drones: city movement visible over time.
Balcony rain reflections: small animated glints near the wet ledge.
Normalise quieter audio: optional boost for Spotify at lower app volume.

RECOMMENDED FIRST TEST
----------------------
Dashboard scale: 108% (adjust if needed)
Rain intensity: 68%
Living city effects: ON
City activity / brightness: 70% (increase to 85% for clearer motion)
Animated neon signs: ON
Elevated traffic and distant drones: ON
Balcony rain reflections: ON
Normalise quieter audio: ON
Audio sensitivity: 125%
Visualiser bar intensity: 125%
Bass emphasis: 125%
Show diagnostics: ON for the first test, then OFF
Reduced motion: OFF when testing movement

COUNTDOWN
---------
Set "Show countdown" ON, enter a date in YYYY-MM-DD (e.g., 2027-01-01),
and give it a name. Invalid or blank dates hide it. The countdown uses your
PC's local timezone and counts down to midnight on that date.

AUDIO
-----
Spotify metadata and audio spectrum are independent APIs. The visualiser
requires Wallpaper Engine to receive actual audio callbacks; track metadata
alone is not enough. v0.3 features quiet-input normalisation, but results
can vary by Spotify output, Windows device settings and Wallpaper Engine.
The wallpaper does not alter actual audio output volume.

PERFORMANCE & SAFETY
--------------------
The additional effects use a small transparent canvas overlay, capped
pixel density, and Wallpaper Engine's FPS cap (up to 30 FPS in this version).
The effect layer pauses with Wallpaper Engine and respects Reduced Motion.
The entire project is local; there are no remote scripts, tracking,
background requests, fake security telemetry, or added audio sources.
For demanding games or VirtualBox, set Wallpaper Engine to Pause or Stop.

FOLDER CONTENTS
---------------
index.html         Wallpaper entry point — import THIS file
style.css          Panel layout and scenery styling
script.js          Clocks, calendar, rain, media, properties, render loop
audio-engine.js    Quiet-volume adaptive visualiser
city-effects.js    New city lights, traffic, drones, reflections
project.json       Wallpaper Engine metadata and user settings
assets/night_city.jpg   Original v0.2.1 city artwork
preview.jpg        Wallpaper thumbnail
CHANGELOG.txt      Release notes
TEST_REPORT.txt    Build-time verification summary
TESTING_CHECKLIST.txt   Manual acceptance tests

IMPORTANT: Browser test data/media shown in preview images are synthetic.
Only Wallpaper Engine on your laptop can verify real Spotify capture,
performance, sleep/resume and any display-driver-specific behaviour.
