# Clippy Companion for DSH

A draggable Clippy companion that lives inside the DeepSeek Harness chat area.
It is animated with the OpenClippy sprite sheet and stays out of the sidebar and
the presented-files panel: its drag area is measured from the conversation
column itself and follows layout changes (sidebar collapse, right panel, window
resize, composer growth).

## Features

- **Draggable.** Grab Clippy and move it anywhere inside the chat column.
  The position is clamped to that column and saved in `localStorage`, so it
  survives reloads and adapts to a resized window.
- **Animated.** Idle loops, a greeting on load, and a reaction for every
  comment, all played at the frame durations declared by the sprite manifest.
- **Talkative.** Click Clippy (or press Enter while it has focus) to get a
  short comment in a themed speech bubble.
- **Keyboard accessible.** Focus the companion with Tab, move it with the arrow
  keys (hold Shift for bigger steps), speak with Enter or Space, dismiss the
  bubble with Escape.
- **Theme-aware.** The speech bubble uses the host theme tokens; only the
  artwork keeps its own colours.
- **Reduced motion.** `prefers-reduced-motion: reduce` keeps Clippy in its rest
  pose instead of looping animations.

## Install

This directory is the plugin package. Install it into the current profile with
`plugin_manager`, action `install_bundle`, target equal to this directory:

```
plugin_manager install_bundle C:\Users\user\source\dsh-clippy-companion
```

Then reload the Harness page. The plugin appears as **Clippy Companion** in the
Plugins settings.

## How it works

- `index.js` (Host) serves the two asset files read-only on
  `/clippy-companion/clippy-map.png` and `/clippy-companion/sprite-data.json`.
- `client.js` (Client) registers a hidden probe in `conversation.input.dock`
  that measures the chat column, and the companion itself in `shell.overlay`,
  which floats above the columns without touching the host layout.
- Sprite frames are drawn by shifting the `background-position` of the single
  sheet; timings come straight from `assets/sprite-data.json`.

## Layout of the package

```
index.js            Host half: read-only asset routes
client.js           Client half: probe, companion, animation engine, locale
cordis.patch.yml    Bundle patch inserting the plugin row
locale/             Plugin-manager display metadata (en, ru, zh)
icon.png            Plugin icon cropped from the sprite sheet
assets/             clippy-map.png + sprite-data.json (OpenClippy)
```

## Licence

Plugin code: MIT, see [LICENSE](LICENSE).
Sprites and the frame manifest: MIT, © 2026 OpenClippy Contributors, see
[LICENSE.assets](LICENSE.assets).
