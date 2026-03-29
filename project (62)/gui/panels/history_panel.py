"""gui/panels/history_panel.py — searchable conversion history."""
from __future__ import annotations
import os
import subprocess
import sys
import tkinter as tk
 
from gui.components.theme import *
from gui.components.widgets import card, flat_btn, scrolled_frame
from core.utils import history as hist
 
 
class HistoryPanel:
    def __init__(self, parent: tk.Widget) -> None:
        self.frame = tk.Frame(parent, bg=CARD)
 
        # ── Initialise ALL state before building widgets ───────────────────────
        # Critical: trace_add fires the moment StringVar changes (even during
        # widget construction), so _all, _inner, _stats must exist first.
        self._all:   list           = []
        self._inner: tk.Frame       = tk.Frame()   # placeholder, replaced below
        self._stats: tk.Label       = tk.Label()   # placeholder, replaced below
 
        # ── header ────────────────────────────────────────────────────────────
        hdr = tk.Frame(self.frame, bg=CARD, pady=XS)
        hdr.pack(fill="x", padx=SM)
        tk.Label(hdr, text="Conversion History", font=HEAD, bg=CARD, fg=TXT_H).pack(side="left")
        flat_btn(hdr, "↻ Refresh", self.refresh, fg=ACCENT).pack(side="right")
        flat_btn(hdr, "✕ Clear",   self._clear,  fg=TXT_M).pack(side="right", padx=XS)
 
        # ── search bar ────────────────────────────────────────────────────────
        sr = tk.Frame(self.frame, bg=CARD, pady=XS)
        sr.pack(fill="x", padx=SM)
        self._q = tk.StringVar()
        # Attach trace AFTER StringVar is created but BEFORE Entry.insert,
        # so _filter is only called once the real widgets are in place.
        e = tk.Entry(sr, textvariable=self._q, font=SMALL, bg=SURFACE, fg=TXT,
                     relief="flat", highlightthickness=1, highlightbackground=BORDER)
        e.pack(fill="x", ipady=4)
        e.insert(0, "Search…")
        e.bind("<FocusIn>", lambda ev: e.delete(0, "end") if e.get() == "Search…" else None)
 
        # ── list ──────────────────────────────────────────────────────────────
        wrapper = tk.Frame(self.frame, bg=BORDER)
        wrapper.pack(fill="both", expand=True, padx=SM, pady=XS)
        self._canvas, self._inner = scrolled_frame(wrapper)
 
        self._stats = tk.Label(self.frame, text="", font=SMALL, bg=CARD, fg=TXT_M, pady=2)
        self._stats.pack(fill="x", padx=SM)
 
        # Now that all widgets exist, attach the trace and load data
        self._q.trace_add("write", lambda *_: self._filter())
        self.refresh()
 
    def refresh(self) -> None:
        self._all = list(reversed(hist.load()))
        self._filter()
 
    def _filter(self) -> None:
        q = self._q.get().lower().strip()
        if q in ("", "search…"):
            shown = self._all
        else:
            shown = [r for r in self._all
                     if q in r.get("input",  "").lower()
                     or q in r.get("format", "").lower()]
        self._render(shown)
 
    def _render(self, records: list) -> None:
        for w in self._inner.winfo_children():
            w.destroy()
        if not records:
            msg = "No history yet." if not self._all else "No matches."
            tk.Label(self._inner, text=msg, font=BODY, bg=SURFACE,
                     fg=TXT_M, pady=30).pack(expand=True)
            self._stats.configure(text="")
            return
        for i, r in enumerate(records):
            self._add_row(r, i)
        self._stats.configure(text=f"Showing {len(records)} of {len(self._all)}")
 
    def _add_row(self, r: dict, idx: int) -> None:
        bg  = CARD if idx % 2 == 0 else SURFACE
        row = tk.Frame(self._inner, bg=bg, pady=4)
        row.pack(fill="x", padx=1, pady=1)
 
        ok = r.get("success", True)
        tk.Label(row, text="●", font=SMALL, bg=bg, fg=OK if ok else ERR).pack(side="left", padx=(SM, 4))
 
        ts = r.get("ts", "")[:16].replace("T", "  ")
        tk.Label(row, text=ts, font=("Consolas", 8), bg=bg, fg=TXT_M, width=16).pack(side="left")
 
        in_name  = os.path.basename(r.get("input", "?"))
        out_name = os.path.basename(r.get("output", "?").split(";")[0].strip())
        fmt      = r.get("format", "?")
 
        mid = tk.Frame(row, bg=bg)
        mid.pack(side="left", fill="x", expand=True, padx=XS)
        tk.Label(mid, text=f"{in_name}  →  {fmt}  →  {out_name}",
                 font=SMALL, bg=bg, fg=TXT, anchor="w", wraplength=320).pack(anchor="w")
 
        out_dir = os.path.dirname(r.get("output", "").split(";")[0].strip())
        if out_dir and os.path.isdir(out_dir):
            lbl = tk.Label(row, text="📂", font=BODY, bg=bg, cursor="hand2", padx=SM, fg=ACCENT)
            lbl.pack(side="right")
            lbl.bind("<Button-1>", lambda e, d=out_dir: _open_dir(d))
 
    def _clear(self) -> None:
        hist.clear()
        self._all.clear()
        self._filter()
 
 
def _open_dir(path: str) -> None:
    try:
        if sys.platform == "win32":
            os.startfile(path)
        elif sys.platform == "darwin":
            subprocess.Popen(["open", path])
        else:
            subprocess.Popen(["xdg-open", path])
    except Exception:
        pass