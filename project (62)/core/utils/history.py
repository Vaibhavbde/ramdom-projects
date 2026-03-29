"""
core/utils/history.py
Saves and loads conversion history to ~/.fileconverter/history.json
Max 100 records. Safe to call from any thread.
"""
from __future__ import annotations
import json
from datetime import datetime
from pathlib import Path
from typing import Any

_PATH       = Path.home() / ".fileconverter" / "history.json"
MAX_RECORDS = 100


def save(
    input_path: str,
    output: str | list[str],
    format_choice: str,
    success: bool = True,
) -> None:
    """Append one record. Prunes oldest if over MAX_RECORDS."""
    records = load()
    records.append({
        "ts":      datetime.now().isoformat(timespec="seconds"),
        "input":   input_path,
        "output":  output if isinstance(output, str) else "; ".join(output),
        "format":  format_choice,
        "success": success,
    })
    _write(records[-MAX_RECORDS:])


def load() -> list[dict[str, Any]]:
    try:
        if _PATH.exists():
            return json.loads(_PATH.read_text("utf-8"))
    except Exception:
        pass
    return []


def clear() -> None:
    _PATH.unlink(missing_ok=True)


def _write(records: list[dict]) -> None:
    try:
        _PATH.parent.mkdir(parents=True, exist_ok=True)
        _PATH.write_text(json.dumps(records, indent=2, ensure_ascii=False), "utf-8")
    except Exception:
        pass
