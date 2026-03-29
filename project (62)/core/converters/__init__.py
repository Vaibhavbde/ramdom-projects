"""
core/converters/__init__.py
===========================
dispatch() is the ONLY entry point the GUI calls.
Pure router — zero business logic, zero path manipulation.
"""
from __future__ import annotations
from typing import Literal, Optional
from core.utils.paths import is_image, is_data, is_pdf, is_docx, is_video, ext
from core.utils.logger import get_logger

log = get_logger(__name__)


def dispatch(
    input_path:     str,
    format_choice:  str,
    extra_files:    Optional[list[str]] = None,
    # PDF split parameters
    split_mode:     str = "ranges",
    split_ranges:   Optional[list[tuple[int, int]]] = None,
    split_every_n:  int = 1,
    split_odd_even: str = "odd",
    split_pages:    Optional[list[int]] = None,
    # output
    output_dir:     Optional[str] = None,
) -> str | list[str]:
    """
    Route to the correct converter module.

    Parameters
    ----------
    input_path      : primary source file
    format_choice   : string from the UI dropdown
    extra_files     : additional files (PDF merge, multi-image PDF)
    split_mode      : "ranges" | "every_n" | "odd_even" | "pages"
    split_ranges    : [(start,end),...] for mode="ranges"
    split_every_n   : chunk size for mode="every_n"
    split_odd_even  : "odd" or "even" for mode="odd_even"
    split_pages     : [1,3,5,...] for mode="pages"
    output_dir      : override output directory; None = beside source file
    """
    choice = format_choice.strip()
    e      = ext(input_path)
    log.debug("dispatch | %s  choice=%r  outdir=%s", e, choice, output_dir)

    # ── Image → image ─────────────────────────────────────────────────────────
    if is_image(input_path) and not choice.lower().startswith("pdf"):
        from core.converters.image_conv import convert_image
        return convert_image(input_path, choice.split()[0], output_dir)

    # ── Image(s) → PDF ────────────────────────────────────────────────────────
    if is_image(input_path) and choice.lower().startswith("pdf"):
        from core.converters.image_conv import images_to_pdf
        return images_to_pdf([input_path] + (extra_files or []), output_dir)

    # ── CSV / XLSX ────────────────────────────────────────────────────────────
    if is_data(input_path):
        from core.converters.data_conv import convert_data
        tgt = "xlsx" if "xlsx" in choice.lower() else "csv"
        return convert_data(input_path, tgt, output_dir)

    # ── PDF merge ─────────────────────────────────────────────────────────────
    if is_pdf(input_path) and "merge" in choice.lower():
        from core.converters.pdf_conv import merge_pdfs
        return merge_pdfs([input_path] + (extra_files or []), output_dir)

    # ── PDF split ─────────────────────────────────────────────────────────────
    if is_pdf(input_path) and "split" in choice.lower():
        from core.converters.pdf_conv import split_pdf
        return split_pdf(
            input_path,
            mode        = split_mode,
            ranges      = split_ranges,
            every_n     = split_every_n,
            odd_even    = split_odd_even,
            specific_pages = split_pages,
            output_dir  = output_dir,
        )

    # ── PDF → Word ────────────────────────────────────────────────────────────
    if is_pdf(input_path) and "word" in choice.lower():
        from core.converters.pdf_conv import pdf_to_docx
        return pdf_to_docx(input_path, output_dir)

    # ── PDF → Images ──────────────────────────────────────────────────────────
    if is_pdf(input_path) and "png" in choice.lower():
        from core.converters.pdf_conv import pdf_to_images
        return pdf_to_images(input_path, image_format="png", output_dir=output_dir)

    if is_pdf(input_path) and "jpg" in choice.lower():
        from core.converters.pdf_conv import pdf_to_images
        return pdf_to_images(input_path, image_format="jpg", output_dir=output_dir)

    # ── DOCX → PDF ───────────────────────────────────────────────────────────
    if is_docx(input_path):
        from core.converters.docx_conv import convert_docx_to_pdf
        return convert_docx_to_pdf(input_path, output_dir)

    # ── Video ─────────────────────────────────────────────────────────────────
    if is_video(input_path):
        from core.converters.video_conv import convert_video
        return convert_video(input_path, choice.split()[0], output_dir)

    raise ValueError(f"No converter for '{e}' → '{choice}'")
