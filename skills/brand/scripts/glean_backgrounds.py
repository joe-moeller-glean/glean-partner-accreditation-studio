#!/usr/bin/env python3
"""
Glean brand background generator.

Produces the three canonical Glean surface treatments as PNGs at any resolution:

  oatmeal   Oatmeal canvas + soft teal (top-right) and orchid (bottom-left) corner
            washes. The default surface for content slides, docs and dashboards.
  indigo    Deep indigo sky with a warm coral particle bloom. Title / cover slides.
  sunset    Diagonal orchid -> magenta -> coral gradient. Section dividers, "thank you".

Usage
  python3 glean_backgrounds.py --style oatmeal --width 1920 --height 1080 --out bg.png
  python3 glean_backgrounds.py --all --outdir ./out --width 3840 --height 2160

Requires: pillow, numpy
"""
import argparse
import numpy as np
from PIL import Image, ImageFilter

# --- Brand colors (see references/COLOR.md) ---
OATMEAL      = (0xF6, 0xF3, 0xEB)
TEAL_WASH    = (0xDE, 0xEE, 0xF0)
ORCHID_WASH  = (0xF0, 0xC2, 0xF2)
PEACH_WASH   = (0xFF, 0xCF, 0xBC)
INDIGO_DEEP  = (0x2B, 0x22, 0x8C)
INDIGO       = (0x40, 0x35, 0xC0)
VIOLET       = (0x6B, 0x5A, 0xE0)
CORAL        = (0xE8, 0x63, 0x2E)
MAGENTA_HOT  = (0xF3, 0x74, 0xAD)
ORCHID       = (0xD0, 0x82, 0xC5)
SALMON       = (0xFA, 0x91, 0x83)


def _grids(w, h):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    return x / max(w - 1, 1), y / max(h - 1, 1)


def _blend(base, color, mask):
    """mask in [0,1] -> lerp base toward color."""
    m = mask[..., None]
    return base * (1 - m) + np.array(color, np.float32) * m


def _radial(x, y, cx, cy, rx, ry, falloff=1.6):
    d = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2)
    return np.clip(1.0 - d, 0.0, 1.0) ** falloff


def oatmeal(w, h, seed=7):
    """Oatmeal canvas with teal top-right + orchid bottom-left corner washes."""
    x, y = _grids(w, h)
    img = np.tile(np.array(OATMEAL, np.float32), (h, w, 1))
    # Top-right teal wash: a large soft circle whose edge sweeps across the upper area.
    img = _blend(img, TEAL_WASH, _radial(x, y, 1.02, -0.10, 0.62, 0.58, 1.45) * 0.95)
    # Bottom-left orchid wash, strongest in the very corner.
    img = _blend(img, ORCHID_WASH, _radial(x, y, -0.06, 1.06, 0.34, 0.52, 1.70) * 0.92)
    # Faint peach lift along the bottom edge to warm the footer band.
    img = _blend(img, PEACH_WASH, _radial(x, y, 0.30, 1.14, 0.55, 0.22, 1.9) * 0.30)
    return _finish(img, seed, grain=1.4)


def indigo(w, h, seed=11):
    """Deep indigo sky with a soft coral bloom sweeping beneath a curved horizon."""
    x, y = _grids(w, h)
    rng = np.random.default_rng(seed)
    # Vertical indigo gradient, lighter toward the top-left horizon.
    t = np.clip(y * 1.10 - x * 0.10, 0, 1)
    img = (np.array(INDIGO, np.float32) * (1 - t)[..., None]
           + np.array(INDIGO_DEEP, np.float32) * t[..., None])
    img = _blend(img, VIOLET, _radial(x, y, 0.80, -0.08, 0.90, 0.72, 1.25) * 0.55)

    # Curved "horizon": the edge of a very large circle arcing through the frame.
    arc = np.sqrt(((x - 0.42) / 0.95) ** 2 + ((y + 0.52) / 1.02) ** 2)
    img = _blend(img, (0x8E, 0x7C, 0xF0), np.clip(1 - np.abs(arc - 1.0) * 34, 0, 1) * 0.40)

    # Warm coral bloom below the horizon: broad smooth glow, not speckle.
    band = np.clip((arc - 1.0) * 3.4, 0, 1)
    glow = band * np.clip(1.05 - y * 0.20, 0, 1)
    img = _blend(img, CORAL, _soft(glow, w, h, 0.035) * 0.72)
    img = _blend(img, MAGENTA_HOT, _soft(band * np.clip(y - 0.35, 0, 1), w, h, 0.05) * 0.30)

    # Fine coral filament texture, low contrast, only inside the bloom.
    tex = _soft(rng.random((h, w)).astype(np.float32), w, h, 0.0022)
    tex = np.clip((tex - tex.mean()) * 9.0 + 0.5, 0, 1)
    img = _blend(img, (0xFF, 0x8A, 0x5A), tex * _soft(band, w, h, 0.03) * 0.30)
    return _finish(img, seed, grain=1.5)


def _soft(a, w, h, frac):
    """Gaussian-blur a float mask by a fraction of the image diagonal."""
    r = max(frac * (w ** 2 + h ** 2) ** 0.5, 0.6)
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), "L")
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), np.float32) / 255


def sunset(w, h, seed=3):
    """Diagonal orchid -> magenta -> coral gradient (section dividers)."""
    x, y = _grids(w, h)
    t = np.clip(x * 0.72 + (1 - y) * 0.28, 0, 1)
    img = np.zeros((h, w, 3), np.float32)
    stops = [(0.00, ORCHID), (0.42, MAGENTA_HOT), (0.78, SALMON), (1.00, (0xFF, 0xAC, 0x8C))]
    for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
        m = (t >= t0) & (t <= t1)
        k = np.zeros_like(t)
        k[m] = (t[m] - t0) / (t1 - t0)
        seg = (np.array(c0, np.float32) * (1 - k)[..., None]
               + np.array(c1, np.float32) * k[..., None])
        img = np.where(m[..., None], seg, img)
    # Cool orchid lift in the lower-left so the gradient never reads flat.
    img = _blend(img, (0xA6, 0x7F, 0xD8), _radial(x, y, -0.05, 0.92, 0.55, 0.60, 1.6) * 0.35)
    return _finish(img, seed, grain=1.6)


def _finish(img, seed, grain=1.5):
    """Add a trace of grain so large gradients don't band, then clamp to 8-bit."""
    rng = np.random.default_rng(seed)
    img = img + rng.normal(0, grain, img.shape).astype(np.float32)
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")


STYLES = {"oatmeal": oatmeal, "indigo": indigo, "sunset": sunset}


def main():
    p = argparse.ArgumentParser(description="Generate Glean-brand background images.")
    p.add_argument("--style", choices=sorted(STYLES), default="oatmeal")
    p.add_argument("--all", action="store_true", help="render every style")
    p.add_argument("--width", type=int, default=1920)
    p.add_argument("--height", type=int, default=1080)
    p.add_argument("--out", default="glean-bg.png")
    p.add_argument("--outdir", default=".")
    a = p.parse_args()
    if a.all:
        import os
        os.makedirs(a.outdir, exist_ok=True)
        for name, fn in STYLES.items():
            path = os.path.join(a.outdir, f"glean-bg-{name}.png")
            fn(a.width, a.height).save(path)
            print("wrote", path)
    else:
        STYLES[a.style](a.width, a.height).save(a.out)
        print("wrote", a.out)


if __name__ == "__main__":
    main()
