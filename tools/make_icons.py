#!/usr/bin/env python3
"""Génère les icônes de l'application (PNG) : même motif que le favicon."""
import os
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG = (13, 11, 20)
PINK, LAV, TEAL = (227, 113, 203), (155, 146, 220), (108, 205, 182)

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def draw(size, maskable):
    S = 4  # sur-échantillonnage
    n = size * S
    img = Image.new('RGB', (n, n), BG)
    d = ImageDraw.Draw(img)
    # le motif occupe 62 % (zone sûre des icônes masquables) ou 76 % sinon
    k = 0.62 if maskable else 0.76
    off = (1 - k) / 2
    pts = [(6, 22), (12, 10), (18, 20), (26, 8)]
    sc = lambda x, y: ((off + (x - 4) / 24 * k) * n, (off + (y - 4) / 24 * k) * n)
    P = [sc(x, y) for x, y in pts]
    w = max(2, int(3.2 / 24 * k * n))
    segs = []
    for i in range(len(P) - 1):
        steps = 60
        for s in range(steps):
            t0 = (i + s / steps) / (len(P) - 1)
            a = (P[i][0] + (P[i + 1][0] - P[i][0]) * s / steps, P[i][1] + (P[i + 1][1] - P[i][1]) * s / steps)
            b = (P[i][0] + (P[i + 1][0] - P[i][0]) * (s + 1) / steps, P[i][1] + (P[i + 1][1] - P[i][1]) * (s + 1) / steps)
            col = lerp(PINK, TEAL, t0) if t0 > 0.5 else lerp(PINK, LAV, t0 * 2)
            if t0 > 0.5: col = lerp(LAV, TEAL, (t0 - 0.5) * 2)
            d.line([a, b], fill=col, width=w)
            r = w / 2
            d.ellipse([b[0] - r, b[1] - r, b[0] + r, b[1] + r], fill=col)
    img = img.resize((size, size), Image.LANCZOS)
    if not maskable:  # coins arrondis
        mask = Image.new('L', (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.22), fill=255)
        out = Image.new('RGBA', (size, size), (0, 0, 0, 0)); out.paste(img, (0, 0), mask)
        return out
    return img

os.makedirs(os.path.join(ROOT, 'icons'), exist_ok=True)
for name, size, mk in (('icon-192.png', 192, False), ('icon-512.png', 512, False), ('icon-maskable-512.png', 512, True), ('apple-touch-icon.png', 180, True)):
    draw(size, mk).save(os.path.join(ROOT, 'icons', name), optimize=True)
    print(name)
