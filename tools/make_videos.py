#!/usr/bin/env python3
"""Generate looping, science-themed preview videos for the project cards.

Renders frames with numpy and pipes raw RGB into ffmpeg (libx264).
Output: public/videos/<name>.mp4 (+ .jpg poster) — 640x360, 30fps, 4s loop.
"""
import math
import os
import random
import subprocess

import numpy as np

W, H, FPS, SECS = 640, 360, 30, 4
N = FPS * SECS
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "videos")
os.makedirs(OUT, exist_ok=True)


# ---------------------------------------------------------------- helpers ---
def writer(path):
    return subprocess.Popen(
        ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "24",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", path],
        stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def vgrad(top, bottom):
    """Vertical gradient, returns (H,1,3)."""
    t = np.linspace(0.0, 1.0, H)[:, None, None]
    top = np.array(top, np.float64)
    bottom = np.array(bottom, np.float64)
    return (top * (1 - t) + bottom * t).reshape(H, 1, 3)


def glow(frame, x, y, r, color, a=1.0):
    """Additive soft glow dot on a float frame (cropped for speed)."""
    x, y = float(x), float(y)
    r = max(1.0, float(r))
    x0, x1 = max(0, int(x - r * 2)), min(W, int(x + r * 2) + 1)
    y0, y1 = max(0, int(y - r * 2)), min(H, int(y + r * 2) + 1)
    if x1 <= x0 or y1 <= y0:
        return
    yy, xx = np.mgrid[y0:y1, x0:x1]
    d2 = (xx - x) ** 2 + (yy - y) ** 2
    m = np.clip(1.0 - d2 / (r * r * 2.2), 0.0, 1.0)
    m *= m
    frame[y0:y1, x0:x1] += m[..., None] * (np.array(color, np.float64) * a)


def line_glow(frame, x1, y1, x2, y2, r, color, a=1.0):
    x1, y1, x2, y2 = float(x1), float(y1), float(x2), float(y2)
    length = math.hypot(x2 - x1, y2 - y1)
    steps = max(2, int(length / 2.5))
    for i in range(steps + 1):
        t = i / steps
        glow(frame, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, r, color, a)


def vignette(frame, strength=0.5):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float64)
    d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    frame *= (1.0 - strength * np.clip(d - 0.45, 0, 1) ** 2)[..., None]


def grain(frame, sigma=1.6, seed=None):
    rng = np.random.default_rng(seed)
    frame += rng.normal(0, sigma, (H, W, 1))


def finalize(pipe, frame):
    vignette(frame)
    grain(frame, seed=hash(pipe.args[7]) & 0xFFFF if pipe.args else None)
    pipe.stdin.write(np.clip(frame, 0, 255).astype(np.uint8).tobytes())


def poster(name, at=1.6):
    """Extract a poster frame from the finished mp4."""
    subprocess.run(
        ["ffmpeg", "-y", "-ss", str(at), "-i", os.path.join(OUT, f"{name}.mp4"),
         "-frames:v", "1", "-q:v", "3", os.path.join(OUT, f"{name}.jpg")],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def lerp_color(c1, c2, t):
    return tuple(a + (b - a) * t for a, b in zip(c1, c2))


CYAN = (110, 225, 255)
TEAL = (70, 210, 200)
GREEN = (80, 235, 160)
EMERALD = (52, 211, 153)
BLUE = (96, 160, 255)
VIOLET = (150, 130, 250)
WHITE = (235, 245, 255)


# ------------------------------------------------------------- 1. robotics --
def gen_robotics():
    rng = random.Random(11)
    gx, gy = 40, 36
    cols, rows = W // gx, H // gy

    def node():
        return (rng.randrange(0, cols) * gx + gx // 2, rng.randrange(0, rows) * gy + gy // 2)

    wires = []
    for _ in range(15):
        x0, y0 = node()
        x1, y1 = node()
        mids = [(x1, y0)]
        if rng.random() < 0.35 and abs(x1 - x0) > 2 * gx and abs(y1 - y0) > 2 * gy:
            mx = x0 + (x1 - x0) // 2
            mids = [(mx, y0), (mx, y1)]
        pts = [(x0, y0)] + mids + [(x1, y1)]
        segs = []
        total = 0.0
        for a, b in zip(pts, pts[1:]):
            L = math.hypot(b[0] - a[0], b[1] - a[1])
            segs.append((a, b, L))
            total += L
        wires.append({"pts": pts, "segs": segs, "len": total,
                      "pulses": [{"s": rng.uniform(0, total), "v": 60 + rng.uniform(0, 60)} for _ in range(2)]})

    def pos(wire, s):
        s %= wire["len"]
        for a, b, L in wire["segs"]:
            if s <= L or (a, b, L) == wire["segs"][-1]:
                t = 0 if L == 0 else min(1.0, s / L)
                return a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t
            s -= L
        return wire["pts"][-1]

    pipe = writer(os.path.join(OUT, "robotics.mp4"))
    bg = vgrad((10, 16, 30), (5, 12, 26))
    trail = np.zeros((H, W, 3))
    for f in range(N):
        t = f / N
        frame = np.broadcast_to(bg, (H, W, 3)).copy()
        trail *= 0.80
        for wire in wires:
            for a, b, _ in wire["segs"]:
                line_glow(frame, a[0], a[1], b[0], b[1], 1.1, (46, 120, 140), 0.10)
            for p in wire["pulses"]:
                x, y = pos(wire, p["s"])
                glow(trail, x, y, 3.2, CYAN, 0.55)
                glow(frame, x, y, 7.5, CYAN, 0.30)
                glow(frame, x, y, 2.2, WHITE, 0.9)
                p["s"] += p["v"] / FPS
        sy = (t * H * 1.0) % (H + 120) - 60
        yy, xx = np.mgrid[0:H, 0:W]
        band = np.exp(-((yy - sy) / 26.0) ** 2)
        frame += band[..., None] * np.array((24, 70, 90)) * 0.5
        frame += trail * 0.9
        finalize(pipe, frame)
    pipe.stdin.close()
    pipe.wait()
    poster("robotics")


# ---------------------------------------------------------------- 2. energy --
def gen_energy():
    rng = random.Random(22)
    layers = [
        {"yc": 0.34, "amp": 26, "lam": 300, "spd": 2 * math.pi / SECS, "ph": 0.0, "col": GREEN, "a": 0.55},
        {"yc": 0.52, "amp": 34, "lam": 210, "spd": 3 * math.pi / SECS, "ph": 2.1, "col": EMERALD, "a": 0.42},
        {"yc": 0.68, "amp": 22, "lam": 260, "spd": 2 * math.pi / SECS, "ph": 4.4, "col": TEAL, "a": 0.34},
    ]
    parts = [{"x": rng.uniform(0, W), "y": rng.uniform(0, H), "v": 26 + rng.uniform(0, 46),
              "w": rng.uniform(1, 3), "ph": rng.uniform(0, 6.28), "r": rng.uniform(1.2, 2.6)}
             for _ in range(70)]
    pipe = writer(os.path.join(OUT, "energy.mp4"))
    bg = vgrad((5, 17, 14), (3, 9, 20))
    trail = np.zeros((H, W, 3))
    for f in range(N):
        t = f / FPS
        frame = np.broadcast_to(bg, (H, W, 3)).copy()
        trail *= 0.90
        for L in layers:
            pts = []
            for x in range(0, W + 8, 8):
                y = H * L["yc"] + L["amp"] * math.sin(2 * math.pi * x / L["lam"] + L["ph"] + L["spd"] * t)
                pts.append((x, y))
            for a, b in zip(pts, pts[1:]):
                line_glow(frame, a[0], a[1], b[0], b[1], 1.6, L["col"], L["a"])
        for p in parts:
            p["y"] -= p["v"] / FPS
            x = p["x"] + 10 * math.sin(t * p["w"] + p["ph"])
            if p["y"] < -12:
                p["y"] = H + 12
                p["x"] = rng.uniform(0, W)
            glow(trail, x, p["y"], p["r"], GREEN, 0.35)
            glow(frame, x, p["y"], p["r"] * 2.6, GREEN, 0.22)
        frame += trail * 0.8
        finalize(pipe, frame)
    pipe.stdin.close()
    pipe.wait()
    poster("energy")


# ----------------------------------------------------------------- 3. space --
def gen_space():
    rng = random.Random(33)
    stars = []
    for _ in range(240):
        stars.append({"x": rng.uniform(-1, 1), "y": rng.uniform(-1, 1),
                      "z": rng.uniform(0.08, 1.0), "big": rng.random() < 0.14})
    px, py, pr = W * 0.74, H * 0.62, 44
    pipe = writer(os.path.join(OUT, "space.mp4"))
    bg = vgrad((3, 5, 12), (7, 12, 30))
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float64)
    d2_planet = (xx - px) ** 2 + (yy - py) ** 2
    inside = d2_planet < pr * pr
    nx, ny = (xx - px) / pr, (yy - py) / pr
    nz = np.sqrt(np.clip(1 - nx ** 2 - ny ** 2, 0, 1))
    light = np.clip(0.25 + 0.85 * (-0.55 * nx + -0.6 * ny + 0.58 * nz), 0, 1.25)
    for f in range(N):
        t = f / FPS
        frame = np.broadcast_to(bg, (H, W, 3)).copy()
        for s in stars:
            s["z"] -= 0.28 / FPS
            if s["z"] <= 0.05:
                s["x"], s["y"] = rng.uniform(-1, 1), rng.uniform(-1, 1)
                s["z"] = 1.0
                s["big"] = rng.random() < 0.14
            k = 0.5 / s["z"]
            x, y = W / 2 + s["x"] * k * W * 0.5, H / 2 + s["y"] * k * W * 0.5
            x2 = W / 2 + s["x"] * (0.5 / (s["z"] + 0.28)) * W * 0.5
            y2 = H / 2 + s["y"] * (0.5 / (s["z"] + 0.28)) * W * 0.5
            b = min(1.0, (1.05 - s["z"]) * 1.15)
            col = (190, 220, 255) if s["big"] else (150, 190, 240)
            line_glow(frame, x2, y2, x, y, 1.0 if s["big"] else 0.8, col, 0.30 + 0.65 * b)
        col = np.zeros((H, W, 3))
        base = np.array((36, 110, 190))
        col[inside] = base * light[inside][:, None]
        frame += col * 0.95
        glow(frame, px, py, pr * 2.4, (70, 140, 255), 0.16)
        ma = t * 2 * math.pi / SECS * 2
        mx = px + math.cos(ma) * (pr + 26)
        my = py + math.sin(ma) * (pr + 26) * 0.42
        glow(frame, mx, my, 2.0, WHITE, 0.9)
        glow(frame, mx, my, 7.0, (150, 200, 255), 0.3)
        finalize(pipe, frame)
    pipe.stdin.close()
    pipe.wait()
    poster("space")


# ------------------------------------------------------------------- 4. bio --
def gen_bio():
    rng = random.Random(44)
    motes = [{"x": rng.uniform(0, W), "y": rng.uniform(0, H), "ph": rng.uniform(0, 6.28)}
             for _ in range(26)]
    pipe = writer(os.path.join(OUT, "bio.mp4"))
    bg = vgrad((6, 13, 22), (3, 7, 16))
    cx = W / 2
    for f in range(N):
        t = f / FPS
        frame = np.broadcast_to(bg, (H, W, 3)).copy()
        scroll = 2 * math.pi * t / SECS
        for y in range(0, H, 3):
            ph = y * 0.045 - scroll
            amp = 112 + 16 * math.sin(t * math.pi / SECS)
            depth = 0.5 + 0.5 * math.cos(ph)
            x1 = cx + amp * math.sin(ph)
            x2 = cx + amp * math.sin(ph + math.pi)
            col = lerp_color((64, 226, 168), (96, 158, 255), y / H)
            a = 0.28 + 0.45 * depth
            glow(frame, x1, y, 1.9, col, a)
            glow(frame, x2, y, 1.9, col, a * 0.92)
            if y % 26 == 0:
                line_glow(frame, x1, y, x2, y, 0.9, col, 0.16)
        for m in motes:
            x = (m["x"] + 14 * math.sin(t * 0.7 + m["ph"])) % W
            y = (m["y"] + 20 * math.sin(t * 0.5 + m["ph"] * 2)) % H
            glow(frame, x, y, 1.4, (140, 240, 200), 0.35)
        finalize(pipe, frame)
    pipe.stdin.close()
    pipe.wait()
    poster("bio")


# -------------------------------------------------------------------- 5. ai --
def gen_ai():
    rng = random.Random(55)
    xs = [0.13 * W, 0.38 * W, 0.62 * W, 0.87 * W]
    counts = [5, 7, 7, 4]
    nodes = []
    for li, (x, c) in enumerate(zip(xs, counts)):
        layer = []
        for i in range(c):
            y = H / 2 + (i - (c - 1) / 2) * (H / (c + 2.4)) + rng.uniform(-8, 8)
            layer.append({"x": x, "y": y, "flash": -9.0})
        nodes.append(layer)
    edges = []  # (l, i, j)
    for l in range(3):
        for i, _ in enumerate(nodes[l]):
            for j in range(len(nodes[l + 1])):
                if rng.random() < 0.42:
                    edges.append((l, i, j))

    signals = [{"path": [], "e": 0, "s": 0.0} for _ in range(9)]

    def new_path(sig):
        i = rng.randrange(len(nodes[0]))
        path = []
        l = 0
        while l < 3:
            opts = [e for e in edges if e[0] == l and e[1] == i]
            if not opts:
                break
            e = rng.choice(opts)
            path.append(e)
            i = e[2]
            l += 1
        sig["path"] = path
        sig["s"] = 0.0

    for s in signals:
        new_path(s)
        s["s"] = rng.uniform(0, 3)

    pipe = writer(os.path.join(OUT, "ai.mp4"))
    bg = vgrad((11, 11, 28), (4, 8, 22))
    trail = np.zeros((H, W, 3))
    for f in range(N):
        t = f / FPS
        frame = np.broadcast_to(bg, (H, W, 3)).copy()
        trail *= 0.82
        for (l, i, j) in edges:
            a, b = nodes[l][i], nodes[l + 1][j]
            line_glow(frame, a["x"], a["y"], b["x"], b["y"], 0.8, (96, 116, 210), 0.085)
        for s in signals:
            if not s["path"]:
                new_path(s)
                continue
            e = s["path"][min(int(s["s"]), len(s["path"]) - 1)]
            a, b = nodes[e[0]][e[1]], nodes[e[0] + 1][e[2]]
            tt = s["s"] - int(s["s"])
            x = a["x"] + (b["x"] - a["x"]) * tt
            y = a["y"] + (b["y"] - a["y"]) * tt
            col = CYAN if e[0] % 2 == 0 else VIOLET
            glow(trail, x, y, 2.4, col, 0.5)
            glow(frame, x, y, 6.5, col, 0.30)
            glow(frame, x, y, 1.8, WHITE, 0.85)
            s["s"] += 2.6 / FPS
            if s["s"] >= len(s["path"]):
                b["flash"] = t
                new_path(s)
        for layer in nodes:
            for nd in layer:
                base = 0.16
                kick = max(0.0, 1.0 - (t - nd["flash"]) / 0.55)
                glow(frame, nd["x"], nd["y"], 3.0 + 2.5 * kick, lerp_color((120, 150, 230), WHITE, min(1, kick)),
                     base + 0.75 * kick)
        frame += trail * 0.85
        finalize(pipe, frame)
    pipe.stdin.close()
    pipe.wait()
    poster("ai")


# ---------------------------------------------------------------- 6. quantum --
def gen_quantum():
    rng = random.Random(66)
    s1 = (W * 0.30, H * 0.52)
    s2 = (W * 0.70, H * 0.52)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r1 = np.sqrt((xx - s1[0]) ** 2 + (yy - s1[1]) ** 2)
    r2 = np.sqrt((xx - s2[0]) ** 2 + (yy - s2[1]) ** 2)
    k = 0.085
    c_lo = np.array([8, 26, 60], np.float32)
    c_mid = np.array([28, 170, 170], np.float32)
    c_hi = np.array([170, 250, 235], np.float32)
    motes = [{"x": rng.uniform(0, W), "y": rng.uniform(0, H), "a": rng.uniform(0, 6.28)}
             for _ in range(80)]
    pipe = writer(os.path.join(OUT, "quantum.mp4"))
    bg = vgrad((5, 9, 22), (2, 4, 12))
    for f in range(N):
        t = f / FPS
        frame = np.broadcast_to(bg, (H, W, 3)).astype(np.float32).copy()
        w = 2 * math.pi / SECS
        I = (np.cos(r1 * k - w * t) + np.cos(r2 * k - w * t)) * 0.5  # -1..1
        v = np.clip((I + 1) * 0.5, 0, 1) ** 1.6
        lo = np.clip(v * 2, 0, 1)[..., None]
        hi = np.clip((v - 0.5) * 2, 0, 1)[..., None]
        field = (c_lo[None, None, :] * (1 - lo)
                 + c_mid[None, None, :] * lo
                 + (c_hi[None, None, :] - c_mid[None, None, :]) * hi)
        frame += field * 0.42
        glow(frame, *s1, 6, CYAN, 0.5)
        glow(frame, *s2, 6, VIOLET, 0.5)
        for m in motes:
            m["a"] += rng.uniform(-0.5, 0.5)
            m["x"] += 1.4 * math.cos(m["a"])
            m["y"] += 1.4 * math.sin(m["a"])
            m["x"] %= W
            m["y"] %= H
            iv = v[int(m["y"]) % H, int(m["x"]) % W]
            glow(frame, m["x"], m["y"], 1.3 + 1.6 * float(iv), WHITE, 0.18 + 0.5 * float(iv))
        finalize(pipe, frame.astype(np.float64))
    pipe.stdin.close()
    pipe.wait()
    poster("quantum")


if __name__ == "__main__":
    import sys
    wanted = sys.argv[1:] or ["robotics", "energy", "space", "bio", "ai", "quantum"]
    gens = {"robotics": gen_robotics, "energy": gen_energy, "space": gen_space,
            "bio": gen_bio, "ai": gen_ai, "quantum": gen_quantum}
    for name in wanted:
        print("rendering", name, flush=True)
        gens[name]()
    print("done")
