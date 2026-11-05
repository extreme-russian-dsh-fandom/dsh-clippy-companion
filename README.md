# Clippy Companion for DSH

A draggable companion that lives inside the DeepSeek Harness chat area, with
switchable sprite packs. Two packs ship in the box: **Clippy** (OpenClippy
sprites) and **Doomguy** (the DOOM II status-bar faces). The drag area is
measured from the conversation column itself, so the companion stays out of the
sidebar and the presented-files panel and follows layout changes (sidebar
collapse, right panel, window resize, composer growth).

## Features

- **Draggable.** Grab the companion and move it anywhere inside the chat column.
  The position is clamped to that column and saved in `localStorage`, so it
  survives reloads and adapts to a resized window.
- **Presets.** Right-click the companion (or long-press on touch) to switch
  between packs, or use **Settings в†’ General в†’ Companion**. The choice is
  remembered.
- **Per-preset voice.** Idle loops, greetings, reactions and the random lines
  all come from the pack's `preset.json`, including its own set of comments.
- **Animated.** Idle loops, a greeting on load, and a reaction for every
  comment, all played at the frame durations declared by the sprite manifest.
- **Talkative.** Click the companion (or press Enter while it has focus) to get
  a short comment in a themed speech bubble.
- **Keyboard accessible.** Focus the companion with Tab, move it with the arrow
  keys (hold Shift for bigger steps), speak with Enter or Space, open the preset
  menu with the Menu key or Shift+F10, dismiss with Escape.
- **Theme-aware.** The speech bubble, menu and settings row use the host theme
  tokens; only the artwork keeps its own colours.
- **Reduced motion.** `prefers-reduced-motion: reduce` keeps the companion in its
  rest frame instead of looping animations.

## Install

This directory is the plugin package. Install it into the current profile with
`plugin_manager`, action `install_bundle`, target equal to this directory:

```
plugin_manager install_bundle C:\Users\user\source\dsh-clippy-companion
```

Then reload the Harness page. The plugin appears as **Clippy Companion** in the
Plugins settings.

## Preset packs

Each pack is a directory under `assets/` with four files:

```
assets/<pack>/
  preset.json        pack descriptor (see below)
  sprite-data.json   frameWidth, frameHeight, animations[{duration, position}]
  <sheet>.png        sprite sheet referenced by preset.json
  LICENSE | LICENSE.md
```

`preset.json`:

```json
{
  "id": "openclippy",
  "version": 1,
  "sprite": "clippy-map.png",
  "manifest": "sprite-data.json",
  "scale": 1,
  "pixelated": false,
  "greeting": "Greeting",
  "rest": "RestPose",
  "idle": ["Idle1_1", "LookLeft", "..."],
  "speech": [{ "key": "clippy.line1", "anim": "Thinking" }]
}
```

- `scale` multiplies frame size and background position; `pixelated` switches
  on nearest-neighbour rendering for pixel art.
- `version` cache-busts the sprite and manifest URLs. Bump it whenever a pack's
  images change, otherwise the browser keeps the old sheet for its cache
  lifetime (`preset.json` itself is always fetched fresh).
- `greeting` plays once after load, `rest` is used for reduced motion and as a
  fallback, `idle` is sampled at random between pauses, and `speech` maps a
  locale key to a reaction animation.
- Add a pack by dropping its directory under `assets/` and adding one row to
  `PRESETS` in `client.js`. No Host change is needed: the asset route is a
  prefix over the whole directory.

## How it works

- `index.js` (Host) exposes `assets/` read-only on
  `/clippy-companion/assets/<pack>/...`, with traversal, extension and content
  type checks.
- `client.js` (Client) registers a hidden probe in `conversation.input.dock`
  that measures the chat column, the companion in `shell.overlay`, and a
  preference row in `settings.general.item`.
- Sprite frames are drawn by shifting `background-position` on the single
  sheet; timings come straight from each pack's `sprite-data.json`.

## Layout of the package

```
index.js            Host half: read-only asset route
client.js           Client half: probe, companion, presets, menu, settings row
cordis.patch.yml    Bundle patch inserting the plugin row
locale/             Plugin-manager display metadata (en, ru, zh)
icon.png            Plugin icon cropped from the sprite sheet
assets/openclippy/  clippy-map.png + sprite-data.json + MIT licence
assets/doom/        faces.png + sprite-data.json + source sheet + notice
tools/              build-doom-pack.py (regenerates the DOOM sheet + manifest)
```

## Licence

Plugin code: MIT, see [LICENSE](LICENSE).

- `assets/openclippy/`: MIT, В© 2026 OpenClippy Contributors, see
  [assets/openclippy/LICENSE](assets/openclippy/LICENSE).
- `assets/doom/`: the DOOM II status-bar faces are В© 1994 id Software LLC /
  ZeniMax Media and are **not** covered by the MIT licence. They are included
  for local, personal use; see [assets/doom/LICENSE.md](assets/doom/LICENSE.md)
  before redistributing this directory or a package that contains it.

