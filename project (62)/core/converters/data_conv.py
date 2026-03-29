"""
core/converters/data_conv.py
Handles: CSV ↔ XLSX
"""
from __future__ import annotations
from typing import Optional
import pandas as pd
from core.utils.paths import build_output_path, ext
from core.utils.logger import get_logger

log = get_logger(__name__)


def convert_data(
    input_path: str,
    target_format: str,
    output_dir: Optional[str] = None,
) -> str:
    src = ext(input_path)
    tgt = target_format.lower().strip(".")

    if src == ".csv" and tgt == "xlsx":
        return _csv_to_xlsx(input_path, output_dir)
    if src in {".xlsx", ".xls"} and tgt == "csv":
        return _xlsx_to_csv(input_path, output_dir)

    raise ValueError(f"Cannot convert '{src}' → '.{tgt}'")


def _csv_to_xlsx(path: str, output_dir: Optional[str]) -> str:
    out = build_output_path(path, ".xlsx", output_dir=output_dir)
    df  = pd.read_csv(path, encoding="utf-8-sig")
    log.info("CSV → XLSX  |  %s", out)

    with pd.ExcelWriter(out, engine="openpyxl") as w:
        df.to_excel(w, index=False, sheet_name="Sheet1")
        ws = w.sheets["Sheet1"]
        for col in ws.columns:
            width = max((len(str(c.value or "")) for c in col), default=8)
            ws.column_dimensions[col[0].column_letter].width = min(width + 4, 60)

    return out


def _xlsx_to_csv(path: str, output_dir: Optional[str]) -> str:
    out = build_output_path(path, ".csv", output_dir=output_dir)
    df  = pd.read_excel(path, engine="openpyxl")
    log.info("XLSX → CSV  |  %s", out)
    df.to_csv(out, index=False, encoding="utf-8-sig")
    return out
