"""Tile stills into one contact sheet: python3 contact.py out.png img1 img2 ..."""
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
cols = 3; w, h = 800, 450
sheet = Image.new("RGB", (cols * w, ((len(files) + cols - 1) // cols) * h), "black")
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((w, h))
    ImageDraw.Draw(im).text((10, 10), f.rsplit("/", 1)[-1], fill="yellow")
    sheet.paste(im, ((i % cols) * w, (i // cols) * h))
sheet.save(out)
