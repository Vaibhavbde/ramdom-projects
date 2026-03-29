"""
core/converters/pdf_conv.py
============================
PDF operations:
  - merge_pdfs          : combine multiple PDFs into one
  - split_pdf           : smart split with 4 modes
  - pdf_to_images       : render each page as PNG/JPG (needs pymupdf)
  - pdf_to_docx         : convert PDF to Word document (needs pdf2docx)
 
Split modes
-----------
  "ranges"   : custom page ranges  e.g. "1-3, 5, 8-10"
  "every_n"  : every N pages       e.g. every 3 pages → chunks
  "odd_even" : odd pages only / even pages only
  "pages"    : extract specific pages  e.g. "2, 5, 8"
"""
from __future__ import annotations
 
from pathlib import Path
from typing import Literal, Optional
 
import PyPDF2
 
from core.utils.paths import build_output_path
from core.utils.logger import get_logger
 
log = get_logger(__name__)
 
SplitMode = Literal["ranges", "every_n", "odd_even", "pages"]
 
 
# ─────────────────────────────────────────────────────────────────────────────
# Merge
# ─────────────────────────────────────────────────────────────────────────────
 
def merge_pdfs(
    paths: list[str],
    output_dir: Optional[str] = None,
) -> str:
    """Merge two or more PDF files into one."""
    if len(paths) < 2:
        raise ValueError(f"Need at least 2 PDFs to merge, got {len(paths)}.")
 
    out = build_output_path(paths[0], ".pdf", suffix="_merged", output_dir=output_dir)
    log.info("merge %d PDFs → %s", len(paths), out)
 
    writer = PyPDF2.PdfWriter()
    for p in paths:
        for page in PyPDF2.PdfReader(p).pages:
            writer.add_page(page)
 
    with open(out, "wb") as fh:
        writer.write(fh)
 
    log.info("merge done: %s", out)
    return out
 
 
# ─────────────────────────────────────────────────────────────────────────────
# Smart Split
# ─────────────────────────────────────────────────────────────────────────────
 
def split_pdf(
    input_path: str,
    mode: SplitMode = "ranges",
    ranges: Optional[list[tuple[int, int]]] = None,
    every_n: int = 1,
    odd_even: Literal["odd", "even"] = "odd",
    specific_pages: Optional[list[int]] = None,
    output_dir: Optional[str] = None,
) -> list[str]:
    """
    Split a PDF using one of four modes.
 
    Parameters
    ----------
    mode:
        "ranges"   — split by custom page ranges (e.g. 1-3, 5-7)
        "every_n"  — split into chunks of N pages each
        "odd_even" — extract only odd or even pages
        "pages"    — extract specific individual pages
 
    ranges:
        List of (start, end) tuples for mode="ranges". 1-indexed, inclusive.
 
    every_n:
        Chunk size for mode="every_n". e.g. every_n=3 on a 10-page doc
        produces pages 1-3, 4-6, 7-9, 10.
 
    odd_even:
        "odd" or "even" for mode="odd_even".
 
    specific_pages:
        List of 1-indexed page numbers for mode="pages".
        e.g. [1, 3, 5] extracts pages 1, 3 and 5 into one output file.
 
    output_dir:
        Where to save output files. None = beside source.
 
    Returns
    -------
    list[str]
        Paths of all created files.
    """
    reader = PyPDF2.PdfReader(input_path)
    total  = len(reader.pages)
    stem   = Path(input_path).stem
    dest   = Path(output_dir) if output_dir else Path(input_path).parent
    dest.mkdir(parents=True, exist_ok=True)
 
    log.info("split_pdf | mode=%s  total=%d  file=%s", mode, total, input_path)
    outputs: list[str] = []
 
    # ── mode: ranges ──────────────────────────────────────────────────────────
    if mode == "ranges":
        if not ranges:
            raise ValueError("mode='ranges' requires a list of page ranges.")
        for start, end in ranges:
            _check_range(start, end, total)
            label = f"{start:03d}" if start == end else f"{start:03d}-{end:03d}"
            out   = str(dest / f"{stem}_pages{label}.pdf")
            _write([reader.pages[i] for i in range(start - 1, end)], out)
            outputs.append(out)
            log.debug("range %d-%d → %s", start, end, out)
 
    # ── mode: every_n ─────────────────────────────────────────────────────────
    elif mode == "every_n":
        if every_n < 1:
            raise ValueError("every_n must be >= 1.")
        chunk = 1
        for start in range(0, total, every_n):
            end   = min(start + every_n, total)
            pages = [reader.pages[i] for i in range(start, end)]
            label = f"{start+1:03d}-{end:03d}"
            out   = str(dest / f"{stem}_chunk{chunk:02d}_pages{label}.pdf")
            _write(pages, out)
            outputs.append(out)
            log.debug("chunk %d  pages %d-%d → %s", chunk, start+1, end, out)
            chunk += 1
 
    # ── mode: odd_even ────────────────────────────────────────────────────────
    elif mode == "odd_even":
        if odd_even not in ("odd", "even"):
            raise ValueError("odd_even must be 'odd' or 'even'.")
        # odd pages = 1,3,5,...  (index 0,2,4,...)
        # even pages = 2,4,6,... (index 1,3,5,...)
        indices = range(0, total, 2) if odd_even == "odd" else range(1, total, 2)
        pages   = [reader.pages[i] for i in indices]
        if not pages:
            raise ValueError(f"No {odd_even} pages found in this document.")
        out = str(dest / f"{stem}_{odd_even}_pages.pdf")
        _write(pages, out)
        outputs.append(out)
        log.debug("%s pages → %s", odd_even, out)
 
    # ── mode: pages ───────────────────────────────────────────────────────────
    elif mode == "pages":
        if not specific_pages:
            raise ValueError("mode='pages' requires a list of page numbers.")
        for p in specific_pages:
            if p < 1 or p > total:
                raise ValueError(f"Page {p} does not exist (document has {total} pages).")
        pages = [reader.pages[p - 1] for p in specific_pages]
        nums  = "_".join(str(p) for p in specific_pages[:6])   # cap label length
        if len(specific_pages) > 6:
            nums += f"_and{len(specific_pages)-6}more"
        out = str(dest / f"{stem}_pages_{nums}.pdf")
        _write(pages, out)
        outputs.append(out)
        log.debug("specific pages %s → %s", specific_pages, out)
 
    else:
        raise ValueError(f"Unknown split mode '{mode}'.")
 
    log.info("split done: %d file(s)", len(outputs))
    return outputs
 
 
# ─────────────────────────────────────────────────────────────────────────────
# PDF → Images
# ─────────────────────────────────────────────────────────────────────────────
 
def pdf_to_images(
    input_path: str,
    image_format: str = "png",
    dpi: int = 150,
    output_dir: Optional[str] = None,
) -> list[str]:
    """
    Render every page of a PDF as an image file.
 
    Requires: pip install pymupdf
 
    Parameters
    ----------
    image_format : "png" or "jpg"
    dpi          : render resolution (150 is good quality, 72 is screen-only)
    """
    try:
        import fitz  # pymupdf
    except ImportError:
        raise ImportError(
            "PDF → Images needs pymupdf.\n"
            "Run:  pip install pymupdf"
        )
 
    fmt  = image_format.lower().strip(".")
    if fmt not in ("png", "jpg", "jpeg"):
        raise ValueError(f"Unsupported image format '{fmt}'. Use: png or jpg")
    ext_out = ".jpg" if fmt in ("jpg", "jpeg") else ".png"
 
    stem  = Path(input_path).stem
    dest  = Path(output_dir) if output_dir else Path(input_path).parent
    dest.mkdir(parents=True, exist_ok=True)
 
    log.info("pdf_to_images | %s  dpi=%d  fmt=%s", input_path, dpi, fmt)
 
    doc     = fitz.open(input_path)
    outputs = []
    mat     = fitz.Matrix(dpi / 72, dpi / 72)   # scale matrix
 
    for i, page in enumerate(doc, 1):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out = str(dest / f"{stem}_page{i:03d}{ext_out}")
        if ext_out == ".png":
            pix.save(out)
        else:
            pix.save(out, jpg_quality=92)
        outputs.append(out)
        log.debug("page %d → %s", i, out)
 
    doc.close()
    log.info("pdf_to_images done: %d image(s)", len(outputs))
    return outputs
 
 
# ─────────────────────────────────────────────────────────────────────────────
# PDF → Word (DOCX)
# ─────────────────────────────────────────────────────────────────────────────
 
def pdf_to_docx(
    input_path: str,
    output_dir: Optional[str] = None,
) -> str:
    """
    Convert a PDF to a Word (.docx) document.
 
    Strategy (tried in order)
    -------------------------
    1. Microsoft Word COM  (Windows + Word installed)
       Best quality — images, tables, and formatting preserved properly.
 
    2. pdf2docx fallback   (pip install pdf2docx, any platform)
       Good for text-heavy PDFs. Images may be repositioned.
 
    Note: Scanned / image-only PDFs won't convert well with either method
    — use PDF → PNG/JPG instead for those.
    """
    out = build_output_path(input_path, ".docx", output_dir=output_dir)
    log.info("pdf_to_docx | %s → %s", input_path, out)
 
    # ── Strategy 1: Microsoft Word COM ───────────────────────────────────────
    import platform
    if platform.system() == "Windows":
        try:
            _pdf_to_docx_via_word(input_path, out)
            log.info("pdf_to_docx | Word COM succeeded: %s", out)
            return out
        except Exception as e:
            log.warning("pdf_to_docx | Word COM failed (%s), trying pdf2docx", e)
 
    # ── Strategy 2: pdf2docx ─────────────────────────────────────────────────
    try:
        from pdf2docx import Converter
    except ImportError:
        raise ImportError(
            "PDF → Word needs pdf2docx.\n"
            "Run:  pip install pdf2docx\n\n"
            "Or install Microsoft Word for better quality conversion."
        )
 
    log.info("pdf_to_docx | using pdf2docx fallback")
    cv = Converter(input_path)
    cv.convert(out, start=0, end=None)
    cv.close()
 
    log.info("pdf_to_docx | pdf2docx done: %s", out)
    return out
 
 
def _pdf_to_docx_via_word(src: str, dst: str) -> None:
    """
    Use Microsoft Word COM to open a PDF and save it as DOCX.
    Word has done this natively since Word 2013.
    Requires: Windows + Microsoft Word installed.
    """
    import pythoncom        # type: ignore
    import win32com.client  # type: ignore
    from pathlib import Path
 
    pythoncom.CoInitialize()
    word = doc = None
    try:
        word               = win32com.client.Dispatch("Word.Application")
        word.Visible       = False
        word.DisplayAlerts = 0
 
        abs_src = str(Path(src).resolve())
        abs_dst = str(Path(dst).resolve())
 
        # Open the PDF — Word converts it automatically on open
        doc = word.Documents.Open(
            abs_src,
            ConfirmConversions=False,
            ReadOnly=True,
        )
 
        # wdFormatXMLDocument = 12  →  saves as .docx
        doc.SaveAs2(abs_dst, FileFormat=12)
        log.debug("_pdf_to_docx_via_word | saved: %s", abs_dst)
 
    finally:
        if doc:
            try:   doc.Close(False)
            except Exception: pass
        if word:
            try:   word.Quit()
            except Exception: pass
        try:   pythoncom.CoUninitialize()
        except Exception: pass
 
 
# ─────────────────────────────────────────────────────────────────────────────
# PDF info
# ─────────────────────────────────────────────────────────────────────────────
 
def pdf_info(path: str) -> dict:
    r    = PyPDF2.PdfReader(path)
    meta = r.metadata or {}
    return {
        "pages":     len(r.pages),
        "title":     str(meta.get("/Title",  "—")),
        "author":    str(meta.get("/Author", "—")),
        "encrypted": r.is_encrypted,
    }
 
 
# ─────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────────────────────────────────────
 
def _write(pages: list, path: str) -> None:
    w = PyPDF2.PdfWriter()
    for p in pages:
        w.add_page(p)
    with open(path, "wb") as fh:
        w.write(fh)
 
 
def _check_range(start: int, end: int, total: int) -> None:
    if start < 1:
        raise ValueError(f"Page numbers start at 1 (got {start}).")
    if end > total:
        raise ValueError(
            f"Page {end} doesn't exist — this PDF only has {total} pages."
        )
    if start > end:
        raise ValueError(f"Start page ({start}) must be ≤ end page ({end}).")