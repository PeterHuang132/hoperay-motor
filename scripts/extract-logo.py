"""Extract the approved red logo, preserving its opaque white numeral."""
from pathlib import Path
import sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

source, destination = map(Path, sys.argv[1:3])
im = Image.open(source).convert("RGB")
rgb = np.asarray(im).astype(float)
h, w = rgb.shape[:2]
chroma = rgb[:, :, 0] - np.maximum(rgb[:, :, 1], rgb[:, :, 2])
red = chroma > 65
digit = np.zeros((h, w), dtype=bool)
stack = [(int(h*.53), int(w*.343))]
while stack:
    y, x = stack.pop()
    if not (0 <= y < h and 0 <= x < w) or digit[y, x] or red[y, x]:
        continue
    digit[y, x] = True
    stack.extend(((y-1,x),(y+1,x),(y,x-1),(y,x+1)))
assert 500 < digit.sum() < h * w * .03, "White numeral selection failed"
digit = np.asarray(Image.fromarray(digit.astype(np.uint8)*255).filter(ImageFilter.MaxFilter(7))) > 0
interior = np.asarray(Image.fromarray(red.astype(np.uint8)*255).filter(ImageFilter.MinFilter(5))) > 0
local_chroma = float(np.median(chroma[interior]))
alpha = np.clip(chroma / local_chroma, 0, 1)
alpha[chroma < 8] = 0
alpha[interior | digit] = 1
foreground = np.clip((rgb - 255 * (1 - alpha[:, :, None])) / np.maximum(alpha[:, :, None], .001), 0, 255)
foreground[interior | digit] = rgb[interior | digit]
rgba = np.dstack((foreground, alpha * 255)).round().astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(destination)
assert (rgba[:, :, 3] == 0).mean() > .5
assert rgba[int(h*.53), int(w*.343), 3] == 255
print(f"Saved {destination}: {w}x{h}; transparent pixels {(rgba[:,:,3] == 0).mean():.1%}")
