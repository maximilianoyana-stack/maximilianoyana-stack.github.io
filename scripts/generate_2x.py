#!/usr/bin/env python3
"""
Generate @2x image variants for images under img/.
- If image width >= 800px, create a resized 2x (width*2) using Lanczos for quality.
- If image width < 800px, copy the original to @2x (avoid aggressive upscaling).
- Skip files that already have @2x in their name.
- Skip unreadable files and log permissions errors.
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', 'img')
ROOT = os.path.normpath(ROOT)

ALLOWED_EXTS = ('.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif')

report = []

for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        name_lower = fn.lower()
        if '@2x' in name_lower:
            continue
        if not any(name_lower.endswith(ext) for ext in ALLOWED_EXTS):
            continue
        src_path = os.path.join(dirpath, fn)
        base, ext = os.path.splitext(fn)
        target = os.path.join(dirpath, base + '@2x' + ext)
        try:
            with Image.open(src_path) as im:
                w, h = im.size

                # Use moderate threshold: if width >= 400, produce a true 2x resize
                # Otherwise copy the original to @2x to avoid severe upscaling
                if w >= 400:
                    new_size = (w * 2, h * 2)
                    resized = im.resize(new_size, Image.LANCZOS)
                    resized.save(target, quality=92)
                    report.append((src_path, target, 'resized', w, h))
                else:
                    im.save(target, quality=92)
                    report.append((src_path, target, 'copied', w, h))

                # Additionally create @3x for very large originals (>=600px)
                if w >= 600:
                    target3 = os.path.join(dirpath, base + '@3x' + ext)
                    new_size3 = (w * 3, h * 3)
                    resized3 = im.resize(new_size3, Image.LANCZOS)
                    resized3.save(target3, quality=90)
                    report.append((src_path, target3, 'resized3', w, h))
        except PermissionError as pe:
            report.append((src_path, None, 'perm_error', str(pe)))
        except Exception as e:
            report.append((src_path, None, 'error', str(e)))

# Print a summary
print('Generate @2x run complete. Summary:')
for r in report:
    print(r)

print('\nNOTE: If you want different upscaling thresholds or formats, edit scripts/generate_2x.py')
