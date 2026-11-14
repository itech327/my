#!/usr/bin/env python3
"""Icônes de la matière isolée : même trajectoire que le portail, avec un engrenage corail (Technologie)."""
import math, os
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG, ARC, CORAL = (13, 11, 20), (112, 102, 150), (242, 123, 96)
P0, P1, P2 = (4, 26), (24, -6), (44, 26)

def bez(t):
    a, b, c = (1 - t) ** 2, 2 * (1 - t) * t, t * t
    return (a * P0[0] + b * P1[0] + c * P2[0], a * P0[1] + b * P1[1] + c * P2[1])

def gear(d, cx, cy, r, teeth=8):
    pts = []
    n = teeth * 4
    for i in range(n):
        a = 2 * math.pi * i / n
        rr = r * (1.0 if (i % 4) in (0, 1) else 0.74)
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=CORAL)
    d.ellipse([cx - r * .33, cy - r * .33, cx + r * .33, cy + r * .33], fill=BG)

def draw(size, maskable):
    S = 4
    n = size * S
    img = Image.new('RGB', (n, n), BG)
    d = ImageDraw.Draw(img)
    k = 0.58 if maskable else 0.74
    sc = n * k / 40
    ox, oy = n / 2 - 24 * sc, n / 2 - 18 * sc
    pt = lambda x, y: (ox + x * sc, oy + y * sc)
    w = 3.4 * sc
    pts = [pt(*bez(i / 120)) for i in range(121)]
    d.line(pts, fill=ARC, width=int(w), joint='curve')
    for q in (pts[0], pts[-1]):
        d.ellipse([q[0] - w / 2, q[1] - w / 2, q[0] + w / 2, q[1] + w / 2], fill=ARC)
    r = 4.4 * sc
    for x, y in ((10, 17.8), (38, 17.8)):
        c = pt(x, y)
        d.ellipse([c[0] - r, c[1] - r, c[0] + r, c[1] + r], fill=CORAL)
    cx, cy = pt(24, 10)
    gear(d, cx, cy, 6.8 * sc)
    img = img.resize((size, size), Image.LANCZOS)
    if not maskable:
        mask = Image.new('L', (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.22), fill=255)
        out = Image.new('RGBA', (size, size), (0, 0, 0, 0)); out.paste(img, (0, 0), mask)
        return out
    return img

out = os.path.join(ROOT, 'matiere', 'icons')
os.makedirs(out, exist_ok=True)
for name, size, mk in (('icon-192.png', 192, False), ('icon-512.png', 512, False), ('icon-maskable-512.png', 512, True), ('apple-touch-icon.png', 180, True)):
    draw(size, mk).save(os.path.join(out, name), optimize=True)
    print(name)
