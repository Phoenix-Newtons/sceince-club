#!/usr/bin/env python3
"""Cover art for blog/about sections (generative, matches the site's video style)
plus poster frames extracted from the project preview videos."""
import math
import os
import random
import subprocess

import numpy as np

W, H = 960, 540
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
BLOG = os.path.join(ROOT, "public", "images", "blog")
VID = os.path.join(ROOT, "public", "videos")
os.makedirs(BLOG, exist_ok=True)
FF = os.environ.get("FFMPEG", "ffmpeg")
DEVNULL = subprocess.DEVNULL


def vgrad(top, bottom):
    t = np.linspace(0.0, 1.0, H)[:, None, None]
    return (np.array(top, float) * (1 - t) + np.array(bottom, float) * t).reshape(H, 1, 3)


def glow(frame, x, y, r, color, a=1.0):
    x, y, r = float(x), float(y), max(1.0, float(r))
    x0, x1 = max(0, int(x - r * 2)), min(W, int(x + r * 2) + 1)
    y0, y1 = max(0, int(y - r * 2)), min(H, int(y + r * 2) + 1)
    if x1 <= x0 or y1 <= y0:
        return
    yy, xx = np.mgrid[y0:y1, x0:x1]
    m = np.clip(1.0 - ((xx - x) ** 2 + (yy - y) ** 2) / (r * r * 2.2), 0, 1) ** 2
    frame[y0:y1, x0:x1] += m[..., None] * (np.array(color, float) * a)


def line_glow(frame, x1, y1, x2, y2, r, color, a=1.0):
    length = math.hypot(x2 - x1, y2 - y1)
    steps = max(2, int(length / 3))
    for i in range(steps + 1):
        t = i / steps
        glow(frame, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, r, color, a)


def vignette(frame, strength=0.5):
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    frame *= (1 - strength * np.clip(d - 0.45, 0, 1) ** 2)[..., None]


def save(frame, path):
    frame = frame.copy()
    vignette(frame)
    frame += np.random.default_rng(3).normal(0, 1.4, (H, W, 1))
    subprocess.run(
        [FF, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "1",
         "-i", "-", "-frames:v", "1", "-q:v", "3", path],
        input=np.clip(frame, 0, 255).astype(np.uint8).tobytes(),
        stdout=DEVNULL, stderr=DEVNULL)
    print("saved", path)


def frame_from(src, at, dst):
    subprocess.run(
        [FF, "-y", "-ss", str(at), "-i", src, "-frames:v", "1",
         "-vf", f"scale={W}:{H}:flags=lanczos", "-q:v", "3", dst],
        stdout=DEVNULL, stderr=DEVNULL)
    print("saved", dst)


# ------------------------------------------------------------- meadow data --
def meadow():
    """Cover for the insect-decline article: a data-mapped wildflower meadow."""
    rng = random.Random(7)
    frame = np.broadcast_to(vgrad((5, 16, 12), (3, 9, 16)), (H, W, 3)).copy()
    # faint hexagonal monitoring grid
    s = 34.0
    hexh = s * math.sqrt(3) / 2
    row = 0
    y = -hexh
    while y < H + hexh:
        xoff = 0 if row % 2 == 0 else s * 1.5
        x = -s * 2 + xoff
        while x < W + s * 2:
            pts = [(x + s * math.cos(math.radians(60 * k)), y + s * math.sin(math.radians(60 * k)))
                   for k in range(7)]
            for a, b in zip(pts, pts[1:]):
                line_glow(frame, a[0], a[1], b[0], b[1], 0.7, (70, 190, 170), 0.035)
            x += s * 3
        y += hexh
        row += 1
    glow(frame, W * 0.2, H * 0.15, 240, (40, 160, 120), 0.07)
    glow(frame, W * 0.85, H * 0.25, 200, (60, 150, 200), 0.06)
    # bokeh flowers
    flower_cols = [(60, 220, 150), (110, 235, 160), (190, 230, 110), (70, 205, 180), (140, 240, 180)]
    for _ in range(18):
        fx, fy = rng.uniform(0, W), rng.uniform(H * 0.35, H)
        r = rng.uniform(9, 34)
        col = rng.choice(flower_cols)
        glow(frame, fx, fy, r, col, rng.uniform(0.08, 0.20))
        glow(frame, fx, fy, rng.uniform(1.6, 3.4), (250, 244, 180), 0.5)
    # insects with dotted flight paths
    for _ in range(20):
        x0, y0 = rng.uniform(0, W), rng.uniform(H * 0.1, H * 0.9)
        ang = rng.uniform(0, 6.28)
        amp = rng.uniform(6, 16)
        ph = rng.uniform(0, 6.28)
        for k in range(9):
            t = k / 8
            x = x0 + math.cos(ang) * 120 * t
            y = y0 + math.sin(ang) * 120 * t + amp * math.sin(t * 9 + ph)
            glow(frame, x, y, 1.5 + (1 - t) * 1.2, (255, 246, 195), (1 - t) * 0.75)
        glow(frame, x0, y0, 2.3, (255, 250, 210), 0.95)
    save(frame, os.path.join(BLOG, "insects.jpg"))


# --------------------------------------------------------- molecule network --
def molecule():
    """Cover for the About section: a constellation of connected curious minds."""
    rng = random.Random(8)
    frame = np.broadcast_to(vgrad((9, 15, 30), (3, 7, 18)), (H, W, 3)).copy()
    glow(frame, W * 0.22, H * 0.3, 300, (30, 110, 200), 0.10)
    glow(frame, W * 0.8, H * 0.72, 280, (24, 150, 110), 0.10)
    nodes = []
    while len(nodes) < 46:
        x, y = rng.uniform(30, W - 30), rng.uniform(30, H - 30)
        if all((x - a) ** 2 + (y - b) ** 2 > 62 ** 2 for a, b, *_ in nodes):
            nodes.append([x, y, rng.random()])
    for a in nodes:
        for b in nodes:
            d2 = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
            if 0 < d2 < 115 ** 2:
                line_glow(frame, a[0], a[1], b[0], b[1], 0.8, (70, 140, 190), 0.09)
    cols = [(110, 225, 255), (80, 235, 160), (240, 248, 255)]
    for x, y, c in nodes:
        col = cols[1] if c < 0.35 else cols[0] if c < 0.85 else cols[2]
        glow(frame, x, y, 6.5, col, 0.16)
        glow(frame, x, y, 2.2, col, 0.85)
    # three highlighted atoms with orbit rings + electrons
    for cx, cy in [(W * 0.28, H * 0.36), (W * 0.66, H * 0.28), (W * 0.55, H * 0.72)]:
        for rot, rr, ry, ec in [(25, 54, 20, (110, 225, 255)), (-35, 64, 24, (80, 235, 160))]:
            pts = []
            for k in range(41):
                th = math.radians(k * 9)
                ex = cx + rr * math.cos(th)
                ey = cy + ry * math.sin(th)
                qx = cx + (ex - cx) * math.cos(math.radians(rot)) - (ey - cy) * math.sin(math.radians(rot))
                qy = cy + (ex - cx) * math.sin(math.radians(rot)) + (ey - cy) * math.cos(math.radians(rot))
                pts.append((qx, qy))
            for a, b in zip(pts, pts[1:]):
                line_glow(frame, a[0], a[1], b[0], b[1], 0.7, ec, 0.14)
            px, py = pts[3]
            glow(frame, px, py, 2.0, (255, 255, 255), 0.9)
        glow(frame, cx, cy, 4.2, (255, 255, 255), 0.95)
        glow(frame, cx, cy, 13, (110, 225, 255), 0.22)
    save(frame, os.path.join(ROOT, "public", "images", "about.jpg"))


if __name__ == "__main__":
    meadow()
    molecule()
    frame_from(os.path.join(VID, "quantum.mp4"), 2.0, os.path.join(BLOG, "qubits.jpg"))
    frame_from(os.path.join(VID, "ai.mp4"), 2.2, os.path.join(BLOG, "ai-lab.jpg"))
    print("covers done")
