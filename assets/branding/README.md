# Approved education logo

The owner supplied `Anla & Ezberle Eğitim Logosu.png` on 31 October 2026 and explicitly approved replacing the application icon with this exact artwork. `approved-education-logo.png` is a byte-for-byte copy. Its source hash and generated output hashes are in `generated-assets.json`.

The owner confirmed during publication that this supplied logo was originally AI-generated/edited; the new store asset carries the corresponding Play label. This integration performed no new AI generation, redraw, recolouring, typography replacement or background removal. The book, stars, wordmark, underline and green/yellow colours remain the owner's illustration. Only outer white margin cropping, proportional Lanczos resizing and white padding are used. The opaque white background is intentional, including on dark system surfaces.

- Application/iOS icon: 1024×1024, RGB, no alpha.
- Android foreground: 1024×1024 RGBA; white art layer matches the configured white background. Coloured artwork fits the central 66/108 safe circle.
- Native splash image: same approved 1024×1024 icon; matching white backgrounds. The separate black **Kovynel Studio** JS intro, its timing and navigation are unchanged.
- Favicon: 64×64. The complete wordmark is preserved; at browser 16 px it is too small to read fully.
- Google Play image: `store/google-play/icon-512.png`, 512×512 RGBA, completely opaque, no pre-rounded corners.

Generate/check using a development Python environment with **Pillow 11.3.0** (not an application dependency):

```sh
python3 -m venv /tmp/anla-logo-tools
/tmp/anla-logo-tools/bin/pip install Pillow==11.3.0
PYTHON=/tmp/anla-logo-tools/bin/python node scripts/generate-brand-assets.mjs
PYTHON=/tmp/anla-logo-tools/bin/python node scripts/generate-brand-assets.mjs --check
```

The existing generator entry point now uses this PNG as its sole source. Old SVG files in `assets/icons/` are retained as legacy assets; running the generator no longer restores those older illustrations.
