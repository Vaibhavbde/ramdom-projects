"""
core/utils/paths.py
===================
THE single source of truth for output-path construction.

Rule: Every converter calls build_output_path(). No exceptions.
"""
from __future__ import annotations
import os
from pathlib import Path
from typing import Optional


def build_output_path(
    input_path: str,
    new_ext: str,
    suffix: str = "_converted",
    output_dir: Optional[str] = None,
) -> str:
    """
    Build a safe, unique output path for a converted file.

    - If output_dir is given  → place file there
    - If output_dir is None   → place file next to the source
    - Never overwrites existing files (auto-increments suffix)
    - Creates output_dir if it doesn't exist

    Examples
    --------
    build_output_path("/tmp/photo.png", ".jpg")
        → "/tmp/photo_converted.jpg"

    build_output_path("/tmp/photo.png", ".jpg", suffix="", output_dir="/out")
        → "/out/photo.jpg"
    """
    src        = Path(input_path)
    stem       = src.stem
    target_dir = Path(output_dir) if output_dir else src.parent

    target_dir.mkdir(parents=True, exist_ok=True)

    candidate = target_dir / f"{stem}{suffix}{new_ext}"
    counter   = 1
    while candidate.exists():
        candidate = target_dir / f"{stem}{suffix}_{counter}{new_ext}"
        counter  += 1

    return str(candidate)


# ── File-type helpers ─────────────────────────────────────────────────────────

IMAGE_EXTS = frozenset({".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif", ".tiff"})
DATA_EXTS  = frozenset({".csv", ".xlsx", ".xls"})
PDF_EXTS   = frozenset({".pdf"})
DOCX_EXTS  = frozenset({".docx", ".doc"})
VIDEO_EXTS = frozenset({".mp4", ".mov", ".avi", ".mkv", ".webm"})

ALL_SUPPORTED = IMAGE_EXTS | DATA_EXTS | PDF_EXTS | DOCX_EXTS | VIDEO_EXTS


def ext(path: str) -> str:
    """Lowercase extension with dot, e.g. '.png'"""
    return Path(path).suffix.lower()


def is_image(path: str) -> bool:
    return ext(path) in IMAGE_EXTS


def is_data(path: str) -> bool:
    return ext(path) in DATA_EXTS


def is_pdf(path: str) -> bool:
    return ext(path) in PDF_EXTS


def is_docx(path: str) -> bool:
    return ext(path) in DOCX_EXTS


def is_video(path: str) -> bool:
    return ext(path) in VIDEO_EXTS


def is_supported(path: str) -> bool:
    return ext(path) in ALL_SUPPORTED


def human_size(path: str) -> str:
    """Return human-readable file size, e.g. '1.4 MB'."""
    try:
        size = os.path.getsize(path)
    except OSError:
        return "?"
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} TB"


def format_options(path: str) -> list[str]:
    """Return valid conversion targets for a given file."""
    e = ext(path)

    if e in IMAGE_EXTS:
        others = [f for f in ("JPG", "PNG", "WEBP", "BMP") if f.lower() != e.lstrip(".")]
        return others + ["PDF (images→pdf)"]

    if e == ".csv":
        return ["XLSX"]

    if e in {".xlsx", ".xls"}:
        return ["CSV"]

    if e in PDF_EXTS:
        return [
            "Merge PDFs",
            "Split PDF",
            "PDF → Word (DOCX)",
            "PDF → PNG (images)",
            "PDF → JPG (images)",
        ]

    if e in DOCX_EXTS:
        return ["PDF"]

    if e in VIDEO_EXTS:
        return ["MP4", "AVI", "MKV", "GIF (clip)"]

    return []


def parse_ranges(raw: str) -> list[tuple[int, int]]:
    """
    Parse '1-3, 5, 7-9' → [(1,3),(5,5),(7,9)]
    Raises ValueError on bad input.
    """
    result = []
    for token in raw.split(","):
        token = token.strip()
        if not token:
            continue
        if "-" in token:
            a, b = token.split("-", 1)
            s, e_ = int(a.strip()), int(b.strip())
        else:
            s = e_ = int(token)
        if s < 1 or e_ < s:
            raise ValueError(f"Bad range '{token}' — use format: 1-3, 5, 7-9")
        result.append((s, e_))
    return result


def parse_pages(raw: str) -> list[int]:
    """
    Parse a comma-separated list of page numbers.
    '2, 5, 8' → [2, 5, 8]
    Raises ValueError on bad input.
    """
    result = []
    for token in raw.split(","):
        token = token.strip()
        if not token:
            continue
        n = int(token)
        if n < 1:
            raise ValueError(f"Page numbers must be >= 1 (got {n}).")
        result.append(n)
    if not result:
        raise ValueError("No page numbers provided.")
    return result
