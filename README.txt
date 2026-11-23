MIDNIGHT OPERATOR v0.2.1 — AUDIO RESPONSE TUNE-UP
=================================================
Standalone, entirely offline Wallpaper Engine WEB wallpaper for Windows.
This is a full new project, not a patch. NO CODE EDITING IS REQUIRED.
Retains v0.2's city artwork, layout, animations, clocks, calendar and music metadata.

IMPORTANT: KEEP v0.2 INSTALLED
-----------------------------
This ZIP is separate and does not alter v0.1 or v0.2.
The separate v0.2.1 wallpaper does not automatically inherit v0.2's saved
Properties, such as your countdown date. Re-enter them in Wallpaper Engine.

INSTALLATION (WINDOWS + WALLPAPER ENGINE)
----------------------------------------
1. Extract the entire ZIP to a NEW folder (not your existing v0.2 folder).
   Example: Documents\WallpaperProjects\Midnight_Operator_v0.2.1\
2. Open Wallpaper Engine > Wallpaper Editor / Create Wallpaper.
3. Drag INDEX.HTML from this extracted new folder onto Create Wallpaper.
   Wallpaper Engine will import its CSS, JS and the assets/ directory.
   Do not drag the ZIP, preview.jpg, audio-engine.js or an older index.html.
4. Save with a unique name: "Midnight Operator v0.2.1".
5. Select the new wallpaper in the Wallpaper Engine Installed tab.
6. Open Properties for this new wallpaper to customise and retest.
7. Leave your existing v0.2 installed. Switch back if anything regresses.

FIRST SPOTIFY TEST (RECOMMENDED DEFAULTS)
-----------------------------------------
- Audio sensitivity / input gain: 125% (new adaptive engine)
- Visualiser bar intensity: 125% (NEW; independent of audio sensitivity)
- Visualiser bass emphasis: 125% (NEW; emphasises lower frequency bars)
- Show diagnostics: ON while testing; OFF for everyday use

1. Play a track in Spotify; audio should be routed to your normal Windows output.
2. Watch Now Playing. Track metadata and actual spectrum are separate APIs.
3. Watch the visualiser. Bars should vary meaningfully with the music.
4. Diagnostics: AUDIO ACTIVE, raw PEAK and GAIN are shown.
   - RAW PEAK in 0.01--0.05 is *normal for your observed input*.
   - GAIN > 1.0x represents internal visual amplification; it does NOT
     modify Spotify volume or the audio you hear.
   - CALLBACKS increases when Wallpaper Engine supplies audio data.
5. Stop or pause music. Bars must fall toward idle; they must not fake music.
6. If bars are still too small: try intensity 150%, then sensitivity 150%.
   If bars are too tall all the time: reduce intensity to 85%-100%.
   For less bass-heavy movement, set bass emphasis to 100%.
7. After testing, disable diagnostics.

COUNTDOWN — EXPLICIT INSTRUCTIONS
---------------------------------
The countdown is still optional and is NOT shown until a valid date is set.
1. In this version's Properties, keep Show countdown ON (default).
2. Enter a future date as YYYY-MM-DD in Countdown target date.
   Example: 2027-01-01
3. Set Countdown label, e.g. NEW YEAR.
4. The timer targets the start of that date (midnight LOCAL computer time).
5. To hide it, turn Show countdown OFF or clear the target date.
6. On shorter screens it moves beneath WORKSPACE to avoid the calendar.
7. Cinematic Mode hides it along with the rest of the dashboard.
Your countdown date from v0.2 is NOT automatically imported into v0.2.1.

OTHER SETTINGS (UNCHANGED FROM v0.2)
------------------------------------
- Rain toggle and intensity slider
- Dashboard / cinematic mode
- Calendar, Workspace, Now Playing visibility
- Dashboard text/cover scale 90%-120%
- Scanlines, Reduced Motion, Diagnostics

PERFORMANCE AND PRIVACY
-----------------------
- No external websites, analytics, trackers, CDN, microphone access or network calls.
- Adaptive gain controls only the visualization. No sound is played/recorded.
- Same 30 FPS ceiling and 240-particle rain cap as v0.2; additional audio
  calculation is bounded to 64 audio bands and 40 screen bars per frame.
- Keep your working Wallpaper Engine battery/fullscreen preferences, including
  Stop (free memory) for fullscreen games or demanding VM workloads.
- Actual Windows Spotify and CPU/GPU/RAM performance require your own retest.
- The projects panel is decorative, not connected to real project data.
- The city background is one image with animated overlays, not animated buildings.

TROUBLESHOOTING
---------------
No Spotify bars, but track text works? Check diagnostics: if WAITING, check
Wallpaper Engine Settings > General > Media and audio recording device.
The audio listener has to receive actual audio samples; media metadata alone
isn't proof of audio capture. If ACTIVE with low RAW PEAK, raise intensity.
If visualiser is too energetic, lower bar intensity and/or sensitivity.
If countdown is absent, enter a valid YYYY-MM-DD date and ensure Cinematic Mode
is off; verify Show countdown is on.
If the UI is clipped, reduce Dashboard scale to 100%, then report resolution.

FILES
-----
index.html        Wallpaper entry point — import this one
style.css         Layout and animations
audio-engine.js   Adaptive audio visualiser signal processing (new)
script.js         Clocks, media integration, controls, canvas rendering
project.json      Wallpaper Engine project metadata and Properties
assets/           Local background artwork
preview.jpg       Wallpaper Engine preview
CHANGELOG.txt     Detailed changes
TESTING_CHECKLIST.txt   Test checklist
TEST_REPORT.txt  Automated browser/synthetic tests and limitations

OFFICIAL REFERENCE
------------------
Import: https://docs.wallpaperengine.io/en/web/first/gettingstarted.html
Audio: https://docs.wallpaperengine.io/en/web/audio/visualizer.html
Media: https://docs.wallpaperengine.io/en/web/audio/media.html
