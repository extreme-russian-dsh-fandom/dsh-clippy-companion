"""Regenerate the DOOM face pack from its source sheets.

Run from the repository root:

    python tools/build-doom-pack.py

Inputs:
  assets/doom/doomguy.png   classic 42-face status-bar sheet (cyan key)
  assets/doom/memes-1.png   Reddit meme face sheet, 7x2
  assets/doom/memes-2.webp  Reddit meme face sheet, 4x2

Outputs:
  assets/doom/faces.png        32x32 frames, transparent
  assets/doom/sprite-data.json frame manifest and damage tiers
"""
import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'assets' / 'doom'
DOOM_SRC = ASSETS / 'doomguy.png'
MEME_SOURCES = ((ASSETS / 'memes-1.png', 7, 2), (ASSETS / 'memes-2.webp', 4, 2))
OUT = ASSETS / 'faces.png'
DATA = ASSETS / 'sprite-data.json'

DOOM_BG = {(0, 255, 255), (84, 109, 142), (149, 177, 200)}
FW = FH = 32
MEME_MAX = (24, 29)


def components(mask, min_pixels):
    """Return connected-component bounding boxes of a boolean mask."""
    height, width = mask.shape
    seen = np.zeros((height, width), bool)
    boxes = []
    for y in range(height):
        for x in range(width):
            if not mask[y, x] or seen[y, x]:
                continue
            queue = deque([(y, x)])
            seen[y, x] = True
            min_x = max_x = x
            min_y = max_y = y
            size = 0
            while queue:
                cy, cx = queue.popleft()
                size += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = cy + dy, cx + dx
                        if (
                            0 <= ny < height
                            and 0 <= nx < width
                            and mask[ny, nx]
                            and not seen[ny, nx]
                        ):
                            seen[ny, nx] = True
                            queue.append((ny, nx))
            if size >= min_pixels:
                boxes.append((min_x, min_y, max_x, max_y))
    return boxes


def key_color_background(image):
    """Classic faces: drop the three flat sheet colours and crop each face."""
    rgb = np.array(image.convert('RGB'))
    mask = np.ones(rgb.shape[:2], bool)
    for color in DOOM_BG:
        mask &= ~np.all(rgb == color, axis=2)
    boxes = sorted(components(mask, 60), key=lambda box: (box[1], box[0]))
    assert len(boxes) == 42, f'expected 42 classic faces, found {len(boxes)}'
    faces = []
    for min_x, min_y, max_x, max_y in boxes:
        crop = image.crop((min_x, min_y, max_x + 1, max_y + 1)).convert('RGBA')
        pixels = crop.load()
        for y in range(crop.height):
            for x in range(crop.width):
                r, g, b, _ = pixels[x, y]
                if (r, g, b) in DOOM_BG:
                    pixels[x, y] = (0, 0, 0, 0)
        faces.append(crop)
    return faces


def flood_background(rgb):
    """Meme sheets have a flat black backdrop; flood-fill it from the edges."""
    near_black = (rgb[:, :, 0] < 10) & (rgb[:, :, 1] < 10) & (rgb[:, :, 2] < 10)
    height, width = near_black.shape
    background = np.zeros((height, width), bool)
    queue = deque()
    for x in range(width):
        for y in (0, height - 1):
            if near_black[y, x] and not background[y, x]:
                background[y, x] = True
                queue.append((y, x))
    for y in range(height):
        for x in (0, width - 1):
            if near_black[y, x] and not background[y, x]:
                background[y, x] = True
                queue.append((y, x))
    while queue:
        cy, cx = queue.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = cy + dy, cx + dx
            if (
                0 <= ny < height
                and 0 <= nx < width
                and near_black[ny, nx]
                and not background[ny, nx]
            ):
                background[ny, nx] = True
                queue.append((ny, nx))
    return background


def matte_edges(rgb, background):
    """Unpremultiply antialiased pixels that touch the keyed background."""
    height, width = background.shape
    boundary = np.zeros((height, width), bool)
    boundary[1:, :] |= background[:-1, :]
    boundary[:-1, :] |= background[1:, :]
    boundary[:, 1:] |= background[:, :-1]
    boundary[:, :-1] |= background[:, 1:]
    edge = boundary & ~background

    source = rgb.astype(np.float32)
    alpha = source.max(axis=2) / 255.0
    safe = np.where(edge, np.maximum(alpha, 0.02), 1.0)
    colors = np.where(edge[:, :, None], np.clip(source / safe[:, :, None], 0, 255), source)
    alpha_out = np.where(edge, np.clip(alpha * 255.0, 0, 255), 255.0)
    alpha_out[background] = 0.0
    return np.dstack([colors, alpha_out]).astype(np.uint8)


def meme_faces(path, columns, rows):
    """Assign background-keyed components to a grid cell and crop the union."""
    image = Image.open(path).convert('RGB')
    rgb = np.array(image)
    background = flood_background(rgb)
    boxes = components(~background, 200)

    height, width = background.shape
    cells = [None] * (columns * rows)
    for min_x, min_y, max_x, max_y in boxes:
        center_x, center_y = (min_x + max_x) / 2, (min_y + max_y) / 2
        column = min(columns - 1, max(0, int(center_x / (width / columns))))
        row = min(rows - 1, max(0, int(center_y / (height / rows))))
        index = row * columns + column
        current = cells[index]
        if current is None:
            cells[index] = [min_x, min_y, max_x, max_y]
        else:
            current[0] = min(current[0], min_x)
            current[1] = min(current[1], min_y)
            current[2] = max(current[2], max_x)
            current[3] = max(current[3], max_y)

    faces = []
    for box in cells:
        if box is None:
            faces.append(None)
            continue
        min_x, min_y, max_x, max_y = box
        crop_rgb = rgb[min_y:max_y + 1, min_x:max_x + 1]
        crop_bg = background[min_y:max_y + 1, min_x:max_x + 1]
        faces.append(Image.fromarray(matte_edges(crop_rgb, crop_bg), 'RGBA'))
    return faces


def place(sheet, face, column, row, max_size=None):
    """Scale a face into its 32x32 cell and paste it bottom-centre."""
    width, height = face.size
    if max_size:
        scale = min(max_size[0] / width, max_size[1] / height)
        width = max(1, round(width * scale))
        height = max(1, round(height * scale))
        face = face.resize((width, height), Image.LANCZOS)
        face = face.filter(ImageFilter.UnsharpMask(radius=1.0, percent=70, threshold=2))
        width, height = face.size
    assert width <= FW and height <= FH, (width, height)
    x = column * FW + (FW - width) // 2
    y = row * FH + (FH - height)
    sheet.alpha_composite(face, (x, y))


def main():
    classic = key_color_background(Image.open(DOOM_SRC).convert('RGB'))
    memes = []
    for path, columns, rows in MEME_SOURCES:
        for face in meme_faces(path, columns, rows):
            if face is not None:
                memes.append(face)
    assert len(memes) == 22, f'expected 22 meme faces, found {len(memes)}'

    total = len(classic) + len(memes)
    columns = 7
    rows = (total + columns - 1) // columns
    sheet = Image.new('RGBA', (FW * columns, FH * rows), (0, 0, 0, 0))

    for index, face in enumerate(classic):
        place(sheet, face, index % columns, index // columns)
    for offset, face in enumerate(memes):
        index = len(classic) + offset
        place(sheet, face, index % columns, index // columns, MEME_MAX)

    positions = [
        {'x': (index % columns) * FW, 'y': (index // columns) * FH}
        for index in range(total)
    ]
    sheet.save(OUT)
    print(f'wrote {OUT.relative_to(ROOT)} ({sheet.width}x{sheet.height}, {total} frames)')

    def animation(indices, duration):
        return {
            'frames': [
                {'duration': duration, 'position': [positions[i]['x'], positions[i]['y']]}
                for i in indices
            ]
        }

    # base, hurt, bad frame indices for every damage-aware animation
    damage = {
        'Idle': ([0, 1, 2], [9, 10, 11], [12, 13, 14]),
        'LookLeft': ([3], [23], [24]),
        'LookRight': ([5], [28], [29]),
        'Grin': ([6, 7, 8], [35, 36, 37], [37, 38, 39]),
        'Pain': ([9, 10, 11], [12, 13, 14], [13, 14, 13]),
        'Angry': ([15, 16, 17], [17, 18, 17], [19, 18, 19]),
        'Rage': ([18, 19, 18], [19, 18, 19], [19]),
        'Scream': ([30, 31, 32, 33, 34], [32, 33, 34], [33, 34, 33]),
        'Dead': ([40], [40], [40]),
        'Wake': ([41, 0], [41, 0], [41, 40]),
    }
    duration = {
        'Idle': 700,
        'LookLeft': 1200,
        'LookRight': 1200,
        'Grin': 240,
        'Pain': 160,
        'Angry': 160,
        'Rage': 130,
        'Scream': 95,
        'Dead': 1300,
        'Wake': 300,
    }

    animations = {}
    for name, tiers in damage.items():
        base, hurt, bad = tiers
        animations[name] = animation(base, duration[name])
        if hurt != base:
            animations[name + 'Hurt'] = animation(hurt, duration[name])
        if bad != hurt:
            animations[name + 'Bad'] = animation(bad, duration[name])

    for offset in range(len(memes)):
        animations[f'Meme{offset + 1:02d}'] = animation([len(classic) + offset], 1600)

    DATA.write_text(
        json.dumps(
            {'frameWidth': FW, 'frameHeight': FH, 'animations': animations},
            indent=2,
        ) + '\n',
        encoding='utf-8',
    )
    print(f'wrote {DATA.relative_to(ROOT)} ({len(animations)} animations)')


if __name__ == '__main__':
    main()
