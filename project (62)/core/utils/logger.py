"""
core/utils/logger.py
Centralised logging — one place, used everywhere.
"""
from __future__ import annotations
import logging
import os
from datetime import datetime
from pathlib import Path

_LOG_DIR   = Path.home() / ".fileconverter" / "logs"
_INIT_DONE = False


def _init() -> None:
    global _INIT_DONE
    if _INIT_DONE:
        return
    root = logging.getLogger("fc")
    root.setLevel(logging.DEBUG)
    root.propagate = False

    # Console
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    ch.setFormatter(logging.Formatter("[%(levelname)s] %(name)s — %(message)s"))
    root.addHandler(ch)

    # File
    try:
        _LOG_DIR.mkdir(parents=True, exist_ok=True)
        fh = logging.FileHandler(
            _LOG_DIR / f"fc_{datetime.now():%Y%m%d}.log", encoding="utf-8"
        )
        fh.setLevel(logging.DEBUG)
        fh.setFormatter(
            logging.Formatter(
                "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
            )
        )
        root.addHandler(fh)
    except OSError:
        pass

    _INIT_DONE = True


def get_logger(name: str) -> logging.Logger:
    _init()
    short = name.split(".")[-1]
    return logging.getLogger(f"fc.{short}")
