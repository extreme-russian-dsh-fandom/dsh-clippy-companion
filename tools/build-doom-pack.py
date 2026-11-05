from PIL import Image
import numpy as np, json
from collections import deque

# Regenerates assets/doom/sprites.png and sprite-data.json from doomguy.png.
# Faces are keyed to transparency and packed bottom-aligned into 32x32 cells.
SRC = 'assets/doom/doomguy.png'
OUT = 'assets/doom/faces.png'
DATA = 'assets/doom/sprite-data.json'
BG = {(0, 255, 255), (84, 109, 142), (149, 177, 200)}

im = Image.open(SRC).convert('RGB')
a = np.array(im)
mask = np.ones(a.shape[:2], dtype=bool)
for c in BG:
    mask &= ~np.all(a == c, axis=2)
H, W = mask.shape
seen = np.zeros((H, W), dtype=bool)
boxes = []
for y in range(H):
    for x in range(W):
        if mask[y, x] and not seen[y, x]:
            q = deque([(y, x)])
            seen[y, x] = True
            minx = maxx = x
            miny = maxy = y
            n = 0
            while q:
                cy, cx = q.popleft()
                n += 1
                minx = min(minx, cx)
                maxx = max(maxx, cx)
                miny = min(miny, cy)
                maxy = max(maxy, cy)
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            q.append((ny, nx))
            if n > 60:
                boxes.append((minx, miny, maxx, maxy))
boxes.sort(key=lambda b: (b[1], b[0]))
assert len(boxes) == 42, len(boxes)

FW, FH = 32, 32
COLS = 7
ROWS = (len(boxes) + COLS - 1) // COLS
sheet = Image.new('RGBA', (FW * COLS, FH * ROWS), (0, 0, 0, 0))
frames = []
for i, (minx, miny, maxx, maxy) in enumerate(boxes):
    crop = im.crop((minx, miny, maxx + 1, maxy + 1)).convert('RGBA')
    px = crop.load()
    for yy in range(crop.height):
        for xx in range(crop.width):
            r, g, b, _ = px[xx, yy]
            if (r, g, b) in BG:
                px[xx, yy] = (0, 0, 0, 0)
    assert crop.width <= FW and crop.height <= FH, (i, crop.size)
    col = i % COLS
    row = i // COLS
    x0 = col * FW + (FW - crop.width) // 2
    y0 = row * FH + (FH - crop.height)
    sheet.alpha_composite(crop, (x0, y0))
    frames.append({'x': col * FW, 'y': row * FH})
sheet.save(OUT)
print('sheet', sheet.size, 'frames', len(frames))

def anim(indices, durations):
    return {
        'frames': [
            {'duration': dur, 'position': [frames[idx]['x'], frames[idx]['y']]}
            for idx, dur in zip(indices, durations)
        ]
    }

animations = {
    'Idle': anim([0, 1, 2], [700, 700, 700]),
    'LookLeft': anim([3], [1200]),
    'LookRight': anim([5], [1200]),
    'Grin': anim([6, 7, 8], [220, 220, 320]),
    'Pain': anim([9, 10, 11], [150, 150, 260]),
    'Angry': anim([15, 16, 17], [150, 150, 300]),
    'Rage': anim([18, 19, 18], [130, 220, 130]),
    'Scream': anim([30, 31, 32, 33, 34], [90, 90, 90, 120, 260]),
    'Dead': anim([40], [1200]),
    'Wake': anim([41, 0], [260, 400]),
}
with open(DATA, 'w', encoding='utf-8') as fh:
    json.dump({'frameWidth': FW, 'frameHeight': FH, 'animations': animations}, fh, indent=2)
print('animations', list(animations))

