"""gui/panels/batch_panel.py — batch conversion queue."""
from __future__ import annotations
import os
import threading
import tkinter as tk
from dataclasses import dataclass, field
from enum import Enum, auto
from tkinter import filedialog, ttk
from typing import Callable, Optional

from gui.components.theme import *
from gui.components.widgets import flat_btn, scrolled_frame
from core.utils.paths import format_options, human_size
from core.utils.logger import get_logger

log = get_logger(__name__)


class Status(Enum):
    PENDING = auto()
    RUNNING = auto()
    DONE    = auto()
    ERROR   = auto()


_DISP = {
    Status.PENDING: ("Pending",     TXT_M,  SURFACE),
    Status.RUNNING: ("Converting…", ACCENT, RUN_BG),
    Status.DONE:    ("Done ✓",      OK,     OK_BG),
    Status.ERROR:   ("Error",       ERR,    ERR_BG),
}


@dataclass
class Job:
    path:   str
    fmt:    str
    status: Status = Status.PENDING
    result: str    = ""
    _lbl:   Optional[tk.Label] = field(default=None, repr=False)
    _row:   Optional[tk.Frame] = field(default=None, repr=False)


class BatchPanel:
    def __init__(
        self,
        parent: tk.Widget,
        on_log:     Callable[[str, str], None] | None = None,
        on_done:    Callable[[], None]          | None = None,
        outdir_var: Optional[tk.StringVar]             = None,
    ) -> None:
        self.frame   = tk.Frame(parent, bg=CARD)
        self._jobs:  list[Job] = []
        self._running           = False
        self._on_log            = on_log   or (lambda m, k: None)
        self._on_done           = on_done  or (lambda: None)
        self._outdir            = outdir_var
        self._build()

    # ── Build ──────────────────────────────────────────────────────────────────

    def _build(self) -> None:
        hdr = tk.Frame(self.frame, bg=CARD, pady=XS)
        hdr.pack(fill="x", padx=SM)
        tk.Label(hdr, text="Batch Queue", font=HEAD, bg=CARD, fg=TXT_H).pack(side="left")
        self._count = tk.Label(hdr, text="0 files", font=SMALL,
                               bg=ACCENT_L, fg=ACCENT, padx=8, pady=2)
        self._count.pack(side="left", padx=SM)

        for txt, cmd, fg in [
            ("▶ Run All", self._start, ACCENT),
            ("+ Add",     self._add,   TXT),
            ("✕ Clear",   self._clear, TXT_M),
        ]:
            flat_btn(hdr, txt, cmd, fg=fg).pack(side="right", padx=2)

        wrapper = tk.Frame(self.frame, bg=BORDER)
        wrapper.pack(fill="both", expand=True, padx=SM, pady=XS)
        self._canvas, self._inner = scrolled_frame(wrapper)

        self._placeholder = tk.Label(
            self._inner, text="No files queued.\nClick  + Add  to start.",
            font=BODY, bg=SURFACE, fg=TXT_M, justify="center", pady=30,
        )
        self._placeholder.pack(expand=True)

        pf = tk.Frame(self.frame, bg=CARD, pady=XS)
        pf.pack(fill="x", padx=SM)
        self._pvar = tk.DoubleVar(value=0)
        ttk.Progressbar(pf, variable=self._pvar, maximum=100,
                        mode="determinate").pack(side="left", fill="x", expand=True, padx=(0, SM))
        self._plbl = tk.Label(pf, text="", font=SMALL, bg=CARD, fg=TXT_M)
        self._plbl.pack(side="right")

    # ── Public ─────────────────────────────────────────────────────────────────

    def add_file(self, path: str, fmt: Optional[str] = None) -> None:
        opts = format_options(path)
        if not opts:
            self._on_log(f"⚠ Skipped (unsupported): {os.path.basename(path)}", "warning")
            return
        job = Job(path=path, fmt=fmt if fmt in opts else opts[0])
        self._jobs.append(job)
        self._render_job(job)
        self._refresh_count()

    # ── Internal ───────────────────────────────────────────────────────────────

    def _add(self) -> None:
        paths = filedialog.askopenfilenames(
            title="Add files to batch",
            filetypes=[("All Supported",
                        "*.jpg *.jpeg *.png *.webp *.bmp "
                        "*.csv *.xlsx *.pdf *.docx *.mp4"), ("All", "*.*")],
        )
        for p in paths:
            self.add_file(p)

    def _clear(self) -> None:
        if self._running: return
        for w in self._inner.winfo_children(): w.destroy()
        self._jobs.clear()
        self._placeholder = tk.Label(
            self._inner, text="No files queued.\nClick  + Add  to start.",
            font=BODY, bg=SURFACE, fg=TXT_M, justify="center", pady=30,
        )
        self._placeholder.pack(expand=True)
        self._refresh_count()
        self._pvar.set(0)
        self._plbl.configure(text="")

    def _refresh_count(self) -> None:
        n = len(self._jobs)
        self._count.configure(text=f"{n} file{'s' if n != 1 else ''}")

    def _render_job(self, job: Job) -> None:
        try: self._placeholder.destroy()
        except: pass

        idx    = len(self._jobs) - 1
        row_bg = CARD if idx % 2 == 0 else SURFACE

        row = tk.Frame(self._inner, bg=row_bg, pady=4)
        row.pack(fill="x", padx=2, pady=1)
        job._row = row

        _ICONS = {".jpg":"🖼",".jpeg":"🖼",".png":"🖼",".webp":"🖼",".bmp":"🖼",
                  ".csv":"📊",".xlsx":"📊",".pdf":"📄",".docx":"📝",".mp4":"🎬"}
        e = os.path.splitext(job.path)[1].lower()
        tk.Label(row, text=_ICONS.get(e,"📁"), font=(F,13), bg=row_bg,
                 fg=ACCENT, width=2).pack(side="left", padx=(SM, 4))

        nc = tk.Frame(row, bg=row_bg)
        nc.pack(side="left", fill="x", expand=True)
        tk.Label(nc, text=os.path.basename(job.path), font=BODY,
                 bg=row_bg, fg=TXT, anchor="w").pack(anchor="w")
        tk.Label(nc, text=human_size(job.path), font=SMALL,
                 bg=row_bg, fg=TXT_M, anchor="w").pack(anchor="w")

        opts    = format_options(job.path)
        fv      = tk.StringVar(value=job.fmt)
        cb      = ttk.Combobox(row, textvariable=fv, values=opts,
                               state="readonly", font=SMALL, width=16)
        cb.pack(side="left", padx=SM)
        cb.bind("<<ComboboxSelected>>", lambda e, v=fv, j=job: setattr(j, "fmt", v.get()))

        lbl = tk.Label(row, text="Pending", font=SMALL, bg=row_bg,
                       fg=TXT_M, padx=8, pady=2, width=12, anchor="center")
        lbl.pack(side="right", padx=SM)
        job._lbl = lbl

        rm = tk.Label(row, text="✕", font=SMALL, bg=row_bg, fg=TXT_M, cursor="hand2", padx=6)
        rm.pack(side="right")
        rm.bind("<Button-1>", lambda e, r=row, j=job: self._remove(r, j))

    def _remove(self, row: tk.Frame, job: Job) -> None:
        if not self._running:
            self._jobs.remove(job)
            row.destroy()
            self._refresh_count()

    def _update_job(self, job: Job) -> None:
        if not job._lbl: return
        label, fg, bg = _DISP[job.status]
        job._lbl.configure(text=label, fg=fg, bg=bg)
        if job._row: job._row.configure(bg=bg)

    # ── Runner ────────────────────────────────────────────────────────────────

    def _start(self) -> None:
        if self._running or not self._jobs: return
        for job in self._jobs:
            if job.status != Status.DONE:
                job.status = Status.PENDING
                self.frame.after(0, self._update_job, job)
        self._running = True
        threading.Thread(target=self._run_all, daemon=True).start()

    def _run_all(self) -> None:
        from core.converters import dispatch
        total, done = len(self._jobs), 0

        for i, job in enumerate(self._jobs):
            if job.status == Status.DONE:
                done += 1; continue

            job.status = Status.RUNNING
            self.frame.after(0, self._update_job, job)
            self.frame.after(0, self._set_prog, done, total, f"Job {i+1}/{total}…")

            out_dir = self._outdir.get() if self._outdir else None
            if out_dir == "Same folder as source": out_dir = None

            try:
                result    = dispatch(job.path, job.fmt, output_dir=out_dir)
                job.status = Status.DONE
                job.result = result if isinstance(result, str) else "; ".join(result)
                nm = os.path.basename(job.path)
                if isinstance(result, list):
                    self._on_log(f"✅ {nm} → {len(result)} file(s)", "success")
                else:
                    self._on_log(f"✅ {nm} → {os.path.basename(result)}", "success")
            except Exception as exc:
                job.status = Status.ERROR
                log.error("batch | %s | %s", job.path, exc)
                self._on_log(f"❌ {os.path.basename(job.path)}: {exc}", "error")

            done += 1
            self.frame.after(0, self._update_job, job)
            self.frame.after(0, self._set_prog, done, total, f"{done}/{total} done")

        self.frame.after(0, self._finish, done, total)

    def _set_prog(self, done: int, total: int, label: str) -> None:
        self._pvar.set((done/total*100) if total else 0)
        self._plbl.configure(text=label)

    def _finish(self, done: int, total: int) -> None:
        self._running = False
        errs = sum(1 for j in self._jobs if j.status == Status.ERROR)
        self._plbl.configure(text=f"{done-errs}/{total} OK, {errs} failed")
        self._on_log(f"─── Batch done: {done-errs}/{total} OK ───", "muted")
        self._on_done()
