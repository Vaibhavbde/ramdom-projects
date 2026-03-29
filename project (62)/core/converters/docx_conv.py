"""
core/converters/docx_conv.py
DOCX → PDF with three strategies (tried in order):

  1. Microsoft Word COM  (Windows + Word installed)  — perfect output
  2. LibreOffice CLI     (if installed, any OS)      — near-perfect
  3. ReportLab fallback  (always available)          — plain text PDF

No dependency on python-docx for the fallback path —
we read the ZIP/XML ourselves so it always works.
"""
from __future__ import annotations
import platform
import subprocess
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Optional

from core.utils.paths import build_output_path
from core.utils.logger import get_logger

log = get_logger(__name__)
_WORD_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"


def convert_docx_to_pdf(
    input_path: str,
    output_dir: Optional[str] = None,
) -> str:
    out = build_output_path(input_path, ".pdf", output_dir=output_dir)
    log.info("DOCX → PDF  |  %s", input_path)

    # Strategy 1 — Word COM (Windows only)
    if platform.system() == "Windows":
        try:
            _via_word(input_path, out)
            log.info("DOCX→PDF via Word COM: %s", out)
            return out
        except Exception as e:
            log.warning("Word COM failed (%s), trying LibreOffice", e)

    # Strategy 2 — LibreOffice CLI
    try:
        _via_libreoffice(input_path, out)
        log.info("DOCX→PDF via LibreOffice: %s", out)
        return out
    except Exception as e:
        log.warning("LibreOffice failed (%s), using ReportLab fallback", e)

    # Strategy 3 — ReportLab fallback
    _via_reportlab(input_path, out)
    log.info("DOCX→PDF via ReportLab: %s", out)
    return out


# ── Strategy 1: Word COM ──────────────────────────────────────────────────────

def _via_word(src: str, dst: str) -> None:
    import pythoncom       # type: ignore
    import win32com.client # type: ignore

    pythoncom.CoInitialize()
    word = doc = None
    try:
        word            = win32com.client.Dispatch("Word.Application")
        word.Visible    = False
        word.DisplayAlerts = 0
        doc = word.Documents.Open(str(Path(src).resolve()))
        doc.SaveAs(str(Path(dst).resolve()), FileFormat=17)  # wdFormatPDF
    finally:
        if doc:
            try: doc.Close(False)
            except: pass
        if word:
            try: word.Quit()
            except: pass
        try: pythoncom.CoUninitialize()
        except: pass


# ── Strategy 2: LibreOffice CLI ───────────────────────────────────────────────

def _via_libreoffice(src: str, dst: str) -> None:
    dst_dir = str(Path(dst).parent)
    candidates = [
        "soffice",
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        "/usr/bin/soffice",
        "/usr/local/bin/soffice",
        "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    ]
    exe = next((c for c in candidates if _can_run(c)), None)
    if not exe:
        raise FileNotFoundError("LibreOffice not found")

    result = subprocess.run(
        [exe, "--headless", "--convert-to", "pdf", "--outdir", dst_dir, src],
        capture_output=True, timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.decode(errors="replace"))

    # LibreOffice names the file <stem>.pdf — rename to our target if different
    generated = Path(dst_dir) / (Path(src).stem + ".pdf")
    if generated.exists() and str(generated) != dst:
        generated.rename(dst)


def _can_run(cmd: str) -> bool:
    try:
        subprocess.run([cmd, "--version"], capture_output=True, timeout=5)
        return True
    except Exception:
        return False


# ── Strategy 3: ReportLab text extraction ────────────────────────────────────

def _extract_text(src: str) -> list[str]:
    try:
        with zipfile.ZipFile(src, "r") as zf:
            if "word/document.xml" not in zf.namelist():
                return ["[Document content unavailable]"]
            xml_bytes = zf.read("word/document.xml")
    except Exception as e:
        return [f"[Could not read file: {e}]"]

    try:
        root = ET.fromstring(xml_bytes)
        ns   = {"w": _WORD_NS}
        return [
            "".join(t.text for t in p.findall(".//w:t", ns) if t.text)
            for p in root.findall(".//w:p", ns)
        ]
    except ET.ParseError as e:
        return [f"[XML error: {e}]"]


def _via_reportlab(src: str, dst: str) -> None:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles    import getSampleStyleSheet
    from reportlab.lib.units     import cm
    from reportlab.platypus      import Paragraph, SimpleDocTemplate, Spacer

    paras  = _extract_text(src)
    styles = getSampleStyleSheet()
    style  = styles["BodyText"]
    style.leading    = 16
    style.spaceAfter = 4

    doc   = SimpleDocTemplate(
        dst, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm,  bottomMargin=2*cm,
    )
    story = []
    for text in paras:
        if not text.strip():
            story.append(Spacer(1, 6))
            continue
        safe = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        story.append(Paragraph(safe, style))

    doc.build(story)
