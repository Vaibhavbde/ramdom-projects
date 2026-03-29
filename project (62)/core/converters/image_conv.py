"""
core/converters/image_conv.py
Handles: image → image, image(s) → PDF
Uses Pillow only.
"""
from __future__ import annotations
from typing import Optional
from PIL import Image
from core.utils.paths import build_output_path
from core.utils.logger import get_logger

log = get_logger(__name__)

_FMT = {
    "jpg":  ("JPEG", ".jpg"),
    "jpeg": ("JPEG", ".jpg"),
    "png":  ("PNG",  ".png"),
    "webp": ("WEBP", ".webp"),
    "bmp":  ("BMP",  ".bmp"),
}


def _to_rgb(img: Image.Image) -> Image.Image:
    """Flatten transparency onto white background (needed for JPEG)."""
    if img.mode in ("RGB", "L"):
        return img
    bg = Image.new("RGB", img.size, (255, 255, 255))
    if img.mode in ("RGBA", "LA"):
        bg.paste(img, mask=img.split()[-1])
    else:
        bg.paste(img.convert("RGBA"), mask=img.convert("RGBA").split()[-1])
    return bg


def convert_image(
    input_path: str,
    target_format: str,
    output_dir: Optional[str] = None,
) -> str:
    """Convert one image to another format."""
    key = target_format.lower().strip(".")
    if key not in _FMT:
        raise ValueError(f"Unsupported format '{target_format}'. Try: {list(_FMT)}")

    pil_fmt, ext = _FMT[key]
    out = build_output_path(input_path, ext, output_dir=output_dir)
    log.info("image → %s  |  %s", target_format, out)

    with Image.open(input_path) as img:
        final = _to_rgb(img) if pil_fmt == "JPEG" else img
        final.save(out, format=pil_fmt, quality=95)

    return out


def images_to_pdf(
    image_paths: list[str],
    output_dir: Optional[str] = None,
) -> str:
    """Combine one or more images into a single PDF."""
    if not image_paths:
        raise ValueError("Need at least one image.")

    out = build_output_path(
        image_paths[0], ".pdf", suffix="_combined", output_dir=output_dir
    )
    log.info("%d image(s) → PDF  |  %s", len(image_paths), out)

    imgs = [_to_rgb(Image.open(p)) for p in image_paths]
    first, rest = imgs[0], imgs[1:]

    save_kw: dict = {"format": "PDF"}
    if rest:
        save_kw.update(save_all=True, append_images=rest)

    first.save(out, **save_kw)
    for i in imgs:
        i.close()

    return out
