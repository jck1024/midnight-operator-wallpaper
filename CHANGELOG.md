# Midnight Operator — Release history

## v1.0.0 — Stable Release (22 November 2026)

**Intent:** validate, optimise and package the accepted v0.4 design for sustained daily use. No major visual overhaul.

- Reused cached London and Hong Kong clock/date formatters and the UK calendar formatter to eliminate needless repeated formatter creation every second.
- Reduced canvas reallocations when changing sliders or colour settings, while keeping necessary resize behaviour for screen geometry, performance profile and HUD layout changes.
- Skipped rain, city or audio spectrum paint operations when their respective UI layers are hidden/disabled. Kept existing pause and audio callbacks.
- Preserved all v0.4 themes, layouts, presets, city lighting controls and Eco mode.
- Added versioned documentation, explicit regression checklist and ZIP/file hashes.

## v0.4 — Personalisation & Polish (accepted)

- Three dashboard colour themes and three layouts.
- Display presets, widget visibility controls, dashboard width, ambient lighting and Eco mode.

## v0.3 — Living City (accepted)

- Independent animated windows, signs, rail traffic, distant lights and reflections.
- Quieter-input Spotify audio normalisation.

## v0.2.1 — Audio tuning (accepted)

- Adaptive audio response, bass emphasis and countdown improvements.

## v0.2 — Motion & Audio Repair (accepted)

- Repaired Wallpaper Engine audio-processing declaration and strengthened animations and panel readability.

## v0.1 — Initial prototype

- City artwork, initial widgets and base animated desktop design.
