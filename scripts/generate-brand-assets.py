"""Resize the owner's approved PNG without redrawing, recolouring or removing details.

Development-only dependency: Pillow 11.3.0. Run with --check to verify outputs.
The archived SVGs in assets/icons are not the current branding source.
"""
from io import BytesIO
from pathlib import Path
import argparse
import hashlib
import json

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/branding/approved-education-logo.png"
# Discard only the outer white margin, keeping 24 px around all coloured artwork.
CROP = (199, 151, 1078, 1136)


def png(image):
    output = BytesIO()
    image.save(output, format="PNG", optimize=True)
    return output.getvalue()


def panel(art, size, height):
    scaled = art.resize((round(art.width * height / art.height), height), Image.Resampling.LANCZOS)
    result = Image.new("RGB", (size, size), "white")
    result.paste(scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2))
    return result


def generate():
    source = Image.open(SOURCE).convert("RGB")
    art = source.crop(CROP)
    icon = panel(art, 1024, 900)
    # All coloured logo pixels fit inside Android's central 66/108 safe circle.
    foreground = panel(art, 1024, 502).convert("RGBA")
    images = {
        "assets/images/icon.png": icon,
        "assets/images/adaptive-foreground.png": foreground,
        "assets/images/splash-mark.png": icon,
        "assets/images/favicon.png": icon.resize((64, 64), Image.Resampling.LANCZOS),
        "store/google-play/icon-512.png": icon.resize((512, 512), Image.Resampling.LANCZOS).convert("RGBA"),
    }
    outputs = {name: png(image) for name, image in images.items()}
    manifest = {
        "source": str(SOURCE.relative_to(ROOT)),
        "sourceSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        "sourceSize": list(source.size),
        "sourceCrop": list(CROP),
        "operations": "Crop outer white margin, proportional Lanczos resize, centre on white; no redraw/recolour/background removal",
        "adaptiveSafeCircleDiameter": "66/108 of 1024 px; coloured pixels verified by --check",
        "outputs": {name: {"size": list(images[name].size), "mode": images[name].mode, "sha256": hashlib.sha256(data).hexdigest()} for name, data in outputs.items()},
    }
    outputs["assets/branding/generated-assets.json"] = (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode()
    # Check actual logo geometry rather than merely checking its square dimensions.
    for y in range(foreground.height):
        for x in range(foreground.width):
            r, g, b, _ = foreground.getpixel((x, y))
            if max(r, g, b) - min(r, g, b) > 35 and min(r, g, b) < 220:
                assert (x - 512) ** 2 + (y - 512) ** 2 < (1024 * 33 / 108) ** 2, "Logo outside adaptive safe circle"
    return outputs


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    for name, data in generate().items():
        target = ROOT / name
        if args.check:
            assert target.read_bytes() == data, f"Stale asset: {name}"
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
    print("PASS: approved source, deterministic outputs and adaptive safe circle" if args.check else "Generated approved-logo assets")
