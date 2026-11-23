MIDNIGHT OPERATOR — Wallpaper Engine / Version 0.1.0
===================================================

WHAT THIS IS
A standalone, animated WEB wallpaper, written in HTML, CSS and JavaScript.
Designed for Wallpaper Engine on Windows. Works offline; no dependencies,
third-party scripts, requests to online services, or bundled music.

INSTALL IN WALLPAPER ENGINE
1. Extract the entire ZIP somewhere permanent, such as:
   C:\Users\<you>\Documents\MidnightOperator\
2. Open Wallpaper Engine > Wallpaper Editor / Create Wallpaper.
3. Drag index.html from this extracted folder onto "Create Wallpaper".
4. Wallpaper Engine imports a copy of the whole project. Save the wallpaper.
5. Return to Installed wallpapers and select "Midnight Operator".

   NOTE: Import index.html, NOT the zip file or the static jpg.
   Keep index.html, style.css, script.js, assets/ together in their folder.

WHAT MOVES / WHAT'S LIVE
* Animated rainfall, slow camera drift, haze, and passing train lights.
* Real current UK (Europe/London) and Hong Kong times; UK monthly calendar.
* 40-band audio-reactive spectrum, via Wallpaper Engine audio API.
* Track title/artist/album art from Wallpaper Engine media integration
  when the music player and app settings support it.
* Optional custom date countdown (default off).
* Project names are decorative labels, not live GitHub/project tracking.
* No real CPU, RAM, security logs, or network-status claims.

CUSTOMISE
Select wallpaper > Properties to toggle rain/HUD/calendar/music/projects,
change rain intensity, enable Reduced motion, and supply an optional
countdown (YYYY-MM-DD) and label.

For a plain image you can use in Brave, see Brave_Companion_Wallpaper.jpg.

PERFORMANCE
Frame limiter is automatically capped to 30 FPS and respects lower
limits set by Wallpaper Engine. Start at 15-30 FPS. In Wallpaper Engine's
Performance/Playback settings set full-screen programs to Stop/Free memory,
and pause wallpapers when running on battery if you prefer.

MEDIA NOTES
Album art and track metadata are NOT guaranteed for every program. They
require supported Windows media-session information and Wallpaper Engine
media integration to be enabled. The visualiser requires Wallpaper Engine
running with supported audio capture; opening index.html in a normal browser
will display the wallpaper but cannot read system audio or music details.

EDITING
You own these HTML/CSS/JS source files. Change panel text in index.html,
colours in style.css, animation and logic in script.js. Wallpaper Engine
copies files when importing. To modify the installed copy, use the editor's
Edit > Open in Explorer, then save/reload it.

STATUS
This is a locally generated prototype. Browser rendering and syntax have
been checked, but playback inside your actual Wallpaper Engine installation
has not been tested here.

Wallpaper Engine official guide:
https://docs.wallpaperengine.io/en/web/first/gettingstarted.html
