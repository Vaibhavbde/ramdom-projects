"""
gui/app.py
==========
Main application window — pure tk.Tk, no ttkbootstrap subclassing.
 
Three notebook tabs:
  1. Single File  — drop zone · preview · options · convert
  2. Batch Queue  — multi-file queue
  3. History      — persistent conversion log
"""
from __future__ import annotations
 
import os
import subprocess
import sys
import threading
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk
from typing import List, Optional, Union
 
from gui.components.theme import *
from gui.components.widgets import (
    LogBox, RoundBtn, StatusBadge, card, flat_btn, sep,
)
from gui.panels.batch_panel   import BatchPanel
from gui.panels.history_panel import HistoryPanel
from gui.panels.preview_panel import PreviewPanel
 
from core.converters   import dispatch
from core.utils        import history as hist
from core.utils.paths  import (
    ext, format_options, human_size, is_pdf, parse_ranges, parse_pages,
)
from core.utils.logger import get_logger
 
log = get_logger(__name__)
 
 
class App(tk.Tk):
    """Root window."""
 
    def __init__(self) -> None:
        super().__init__()
        self.title("File Converter")
        self.geometry(f"{W}x{H}")
        self.minsize(MIN_W, MIN_H)
        self.configure(bg=BG)
        self._try_icon()
 
        # single-file state
        self._file:      Optional[str]                   = None
        self._extras:    List[str]                       = []
        self._last_out:  Optional[Union[str, List[str]]] = None
        self._converting = False
        self._spin_idx   = 0
 
        # shared output-dir (used by both single and batch)
        self._outdir = tk.StringVar(value="Same folder as source")
 
        self._build()
        log.info("App started")
 
    def _try_icon(self) -> None:
        ico = Path(__file__).parent.parent / "assets" / "icon.ico"
        if ico.exists():
            try: self.iconbitmap(str(ico))
            except: pass
 
    # ── top-level layout ──────────────────────────────────────────────────────
 
    def _build(self) -> None:
        root = tk.Frame(self, bg=BG)
        root.pack(fill="both", expand=True)
 
        self._header(root)
        sep(root).pack(fill="x")
 
        nb = self._notebook(root)
        nb.pack(fill="both", expand=True, padx=PAD, pady=PAD)
        self._nb = nb
 
        t1 = tk.Frame(nb, bg=BG)
        nb.add(t1, text="  Single File  ")
        self._tab_single(t1)
 
        t2 = tk.Frame(nb, bg=BG)
        nb.add(t2, text="  Batch Queue  ")
        self._tab_batch(t2)
 
        t3 = tk.Frame(nb, bg=BG)
        nb.add(t3, text="  History  ")
        self._tab_history(t3)
 
        nb.bind("<<NotebookTabChanged>>", self._on_tab)
        self._statusbar(root)
 
    # ── header ────────────────────────────────────────────────────────────────
 
    def _header(self, parent: tk.Widget) -> None:
        hdr = tk.Frame(parent, bg=CARD, pady=SM + 2)
        hdr.pack(fill="x")
 
        left = tk.Frame(hdr, bg=CARD)
        left.pack(side="left", padx=PAD + 4)
 
        logo = tk.Canvas(left, width=42, height=42, bg=CARD, highlightthickness=0)
        logo.create_oval(0, 0, 42, 42, fill=ACCENT, outline="")
        logo.create_text(21, 21, text="⇄", fill="#fff", font=(F, 17, "bold"))
        logo.pack(side="left", padx=(0, SM))
 
        tc = tk.Frame(left, bg=CARD)
        tc.pack(side="left")
        tk.Label(tc, text="File Converter",        font=TITLE,    bg=CARD, fg=TXT_H).pack(anchor="w")
        tk.Label(tc, text="Fast · Offline · Free", font=SUBTITLE, bg=CARD, fg=TXT_M).pack(anchor="w")
 
        right = tk.Frame(hdr, bg=CARD)
        right.pack(side="right", padx=PAD + 4)
        for txt, bg_, fg_ in [
            ("🖼 Images", "#EFF6FF", ACCENT),
            ("📊 Data",   "#F0FDF4", OK),
            ("📄 PDF",    "#FEF3C7", WARN),
            ("📝 DOCX",   "#F5F3FF", "#7C3AED"),
            ("🎬 Video",  "#FFF1F2", "#E11D48"),
        ]:
            tk.Label(right, text=txt, font=SMALL, bg=bg_, fg=fg_,
                     padx=10, pady=4).pack(side="left", padx=2)
 
    # ── notebook ──────────────────────────────────────────────────────────────
 
    def _notebook(self, parent: tk.Widget) -> ttk.Notebook:
        s = ttk.Style()
        s.configure("FC.TNotebook",     background=BG, borderwidth=0)
        s.configure("FC.TNotebook.Tab", background=SURFACE, foreground=TXT_M,
                    font=BODY, padding=[PAD, XS], borderwidth=0)
        s.map("FC.TNotebook.Tab",
              background=[("selected", CARD), ("active", ACCENT_L)],
              foreground=[("selected", ACCENT), ("active", ACCENT)])
        return ttk.Notebook(parent, style="FC.TNotebook")
 
    # ─────────────────────────────────────────────────────────────────────────
    # TAB 1 — SINGLE FILE
    # ─────────────────────────────────────────────────────────────────────────
 
    def _tab_single(self, parent: tk.Widget) -> None:
        pw = tk.PanedWindow(parent, orient="horizontal", bg=BG,
                            sashrelief="flat", sashwidth=6)
        pw.pack(fill="both", expand=True)
 
        lp = tk.Frame(pw, bg=BG)
        rp = tk.Frame(pw, bg=BG)
        pw.add(lp, minsize=380, stretch="always")
        pw.add(rp, minsize=280, stretch="always")
 
        # Set sash at 52% of window width after layout is complete
        def _set_sash():
            total = pw.winfo_width()
            if total > 100:
                pw.sash_place(0, int(total * 0.52), 0)
            else:
                parent.after(50, _set_sash)
        parent.after(100, _set_sash)
 
        self._dropzone_card(lp)
        self._options_card(lp)
        self._actions(lp)
        self._right_pane(rp)
 
    # ── drop zone ─────────────────────────────────────────────────────────────
 
    def _dropzone_card(self, parent: tk.Widget) -> None:
        c = card(parent, "Select File")
        c.pack(fill="x", pady=(0, SM))
 
        self._dz = tk.Canvas(c, height=114, bg=SURFACE,
                             highlightthickness=1, highlightbackground=BORDER,
                             cursor="hand2")
        self._dz.pack(fill="x", padx=PAD, pady=SM)
        self._dz.bind("<Button-1>", lambda _: self._browse())
        self._dz.bind("<Configure>", lambda _: self._draw_dz())
 
        strip = tk.Frame(c, bg=CARD)
        strip.pack(fill="x", padx=PAD, pady=(0, SM))
 
        self._f_icon = tk.Label(strip, text="📁", font=(F, 16), bg=CARD, fg=TXT_M)
        self._f_icon.pack(side="left", padx=(0, XS))
 
        nc = tk.Frame(strip, bg=CARD)
        nc.pack(side="left", fill="x", expand=True)
        self._f_name = tk.Label(nc, text="No file selected", font=BODY,
                                bg=CARD, fg=TXT_M, anchor="w")
        self._f_name.pack(anchor="w")
        self._f_meta = tk.Label(nc, text="", font=SMALL, bg=CARD, fg=TXT_M, anchor="w")
        self._f_meta.pack(anchor="w")
 
        # extra-files row (for merge / multi-image)
        self._extra_row = tk.Frame(c, bg=CARD)
        ef = tk.Frame(self._extra_row, bg=CARD)
        ef.pack(fill="x", padx=PAD, pady=(0, SM))
        tk.Label(ef, text="Additional files:", font=BODY, bg=CARD, fg=TXT_M).pack(side="left")
        flat_btn(ef, "+ Add", self._add_extras, fg=ACCENT, bg=ACCENT_L).pack(side="left", padx=SM)
        self._extra_lbl = tk.Label(ef, text="", font=SMALL, bg=CARD, fg=TXT_M)
        self._extra_lbl.pack(side="left")
 
    def _draw_dz(self, active: bool = False) -> None:
        dz = self._dz
        dz.delete("all")
        w, h = dz.winfo_width() or 400, 114
        bdr  = ACCENT if active else BORDER
        dz.configure(bg="#EFF6FF" if active else SURFACE, highlightbackground=bdr)
        dz.create_rectangle(8, 8, w-8, h-8, outline=bdr, dash=(6, 4), width=1)
        cx = w // 2
        dz.create_oval(cx-24, 16, cx+24, 64,
                       fill=ACCENT_L if not active else "#BFDBFE", outline="")
        dz.create_text(cx, 38, text="⬆", font=(F, 20), fill=ACCENT)
        dz.create_text(cx, 78, text="Click to browse a file", font=SMALL, fill=TXT_M)
        dz.create_text(cx, 95,
                       text="Images · CSV · XLSX · PDF · DOCX · Video",
                       font=(F, 8), fill=TXT_D)
 
    # ── options card ──────────────────────────────────────────────────────────
 
    def _options_card(self, parent: tk.Widget) -> None:
        c = card(parent, "Conversion Options")
        c.pack(fill="x", pady=(0, SM))
 
        def row(pady: int = XS) -> tk.Frame:
            r = tk.Frame(c, bg=CARD, pady=pady)
            r.pack(fill="x", padx=PAD)
            return r
 
        # ── format selector ───────────────────────────────────────────────────
        fr = row()
        tk.Label(fr, text="Convert to:", font=BODY, bg=CARD, fg=TXT_M,
                 width=12, anchor="w").pack(side="left")
        self._fmt    = tk.StringVar(value="— select a file —")
        self._fmt_cb = ttk.Combobox(fr, textvariable=self._fmt,
                                    state="disabled", font=BODY, width=28)
        self._fmt_cb.pack(side="left")
        self._fmt_cb.bind("<<ComboboxSelected>>", self._on_fmt)
 
        # ── output dir ────────────────────────────────────────────────────────
        dr = row()
        tk.Label(dr, text="Save to:", font=BODY, bg=CARD, fg=TXT_M,
                 width=12, anchor="w").pack(side="left")
        tk.Entry(dr, textvariable=self._outdir, font=SMALL,
                 bg=SURFACE, fg=TXT, relief="flat",
                 highlightthickness=1, highlightbackground=BORDER,
                 width=24).pack(side="left")
        flat_btn(dr, "…", self._pick_dir, fg=TXT_M, bg=SURFACE).pack(side="left", padx=XS)
 
        # ══════════════════════════════════════════════════════════════════════
        # PDF SPLIT OPTIONS — hidden until "Split PDF" is selected
        # ══════════════════════════════════════════════════════════════════════
        self._split_panel = tk.Frame(c, bg="#F8FAFF",
                                     highlightthickness=1,
                                     highlightbackground="#C7D7F9")
        # (packed/hidden dynamically by _on_fmt)
 
        sp = self._split_panel
 
        # Title
        tk.Label(sp, text="✂  Split Options", font=(F, 10, "bold"),
                 bg="#F8FAFF", fg=ACCENT).pack(anchor="w", padx=SM, pady=(SM, XS))
 
        # Mode selector
        mode_row = tk.Frame(sp, bg="#F8FAFF")
        mode_row.pack(fill="x", padx=SM, pady=XS)
        tk.Label(mode_row, text="Split by:", font=BODY, bg="#F8FAFF",
                 fg=TXT_M, width=10, anchor="w").pack(side="left")
 
        self._split_mode = tk.StringVar(value="ranges")
        modes = [
            ("Page ranges",     "ranges"),
            ("Every N pages",   "every_n"),
            ("Odd / Even",      "odd_even"),
            ("Specific pages",  "pages"),
        ]
        for label, val in modes:
            tk.Radiobutton(
                mode_row, text=label, variable=self._split_mode, value=val,
                font=SMALL, bg="#F8FAFF", fg=TXT,
                activebackground="#F8FAFF",
                command=self._on_split_mode,
            ).pack(side="left", padx=(0, SM))
 
        # ── sub-panels, one per mode ──────────────────────────────────────────
 
        # ranges sub-panel
        self._sp_ranges = tk.Frame(sp, bg="#F8FAFF")
        rr = tk.Frame(self._sp_ranges, bg="#F8FAFF")
        rr.pack(fill="x", padx=SM, pady=(0, SM))
        tk.Label(rr, text="Ranges:", font=SMALL, bg="#F8FAFF",
                 fg=TXT_M, width=10, anchor="w").pack(side="left")
        self._ranges_var = tk.StringVar()
        tk.Entry(rr, textvariable=self._ranges_var, font=SMALL,
                 bg=SURFACE, fg=TXT, relief="flat",
                 highlightthickness=1, highlightbackground=BORDER,
                 width=22).pack(side="left")
        tk.Label(rr, text="e.g.  1-3, 5, 7-9",
                 font=SMALL, bg="#F8FAFF", fg=TXT_D, padx=6).pack(side="left")
 
        # every_n sub-panel
        self._sp_every_n = tk.Frame(sp, bg="#F8FAFF")
        en = tk.Frame(self._sp_every_n, bg="#F8FAFF")
        en.pack(fill="x", padx=SM, pady=(0, SM))
        tk.Label(en, text="Every N pages:", font=SMALL, bg="#F8FAFF",
                 fg=TXT_M, width=14, anchor="w").pack(side="left")
        self._every_n_var = tk.StringVar(value="2")
        tk.Spinbox(en, from_=1, to=999, textvariable=self._every_n_var,
                   font=SMALL, width=5, bg=SURFACE, relief="flat").pack(side="left")
        tk.Label(en, text="pages per chunk",
                 font=SMALL, bg="#F8FAFF", fg=TXT_D, padx=6).pack(side="left")
 
        # odd_even sub-panel
        self._sp_odd_even = tk.Frame(sp, bg="#F8FAFF")
        oe = tk.Frame(self._sp_odd_even, bg="#F8FAFF")
        oe.pack(fill="x", padx=SM, pady=(0, SM))
        tk.Label(oe, text="Keep:", font=SMALL, bg="#F8FAFF",
                 fg=TXT_M, width=10, anchor="w").pack(side="left")
        self._odd_even_var = tk.StringVar(value="odd")
        tk.Radiobutton(oe, text="Odd pages  (1, 3, 5…)",
                       variable=self._odd_even_var, value="odd",
                       font=SMALL, bg="#F8FAFF", fg=TXT,
                       activebackground="#F8FAFF").pack(side="left", padx=(0, SM))
        tk.Radiobutton(oe, text="Even pages  (2, 4, 6…)",
                       variable=self._odd_even_var, value="even",
                       font=SMALL, bg="#F8FAFF", fg=TXT,
                       activebackground="#F8FAFF").pack(side="left")
 
        # pages sub-panel
        self._sp_pages = tk.Frame(sp, bg="#F8FAFF")
        pp = tk.Frame(self._sp_pages, bg="#F8FAFF")
        pp.pack(fill="x", padx=SM, pady=(0, SM))
        tk.Label(pp, text="Pages:", font=SMALL, bg="#F8FAFF",
                 fg=TXT_M, width=10, anchor="w").pack(side="left")
        self._pages_var = tk.StringVar()
        tk.Entry(pp, textvariable=self._pages_var, font=SMALL,
                 bg=SURFACE, fg=TXT, relief="flat",
                 highlightthickness=1, highlightbackground=BORDER,
                 width=22).pack(side="left")
        tk.Label(pp, text="e.g.  2, 5, 8  → one file",
                 font=SMALL, bg="#F8FAFF", fg=TXT_D, padx=6).pack(side="left")
 
        # Show the default sub-panel
        self._on_split_mode()
 
    def _on_split_mode(self) -> None:
        """Show only the sub-panel matching the selected split mode."""
        for panel in (self._sp_ranges, self._sp_every_n,
                      self._sp_odd_even, self._sp_pages):
            panel.pack_forget()
 
        mode = self._split_mode.get()
        {
            "ranges":   self._sp_ranges,
            "every_n":  self._sp_every_n,
            "odd_even": self._sp_odd_even,
            "pages":    self._sp_pages,
        }[mode].pack(fill="x")
 
    def _pick_dir(self) -> None:
        p = filedialog.askdirectory(title="Choose output folder")
        if p: self._outdir.set(p)
 
    # ── action buttons ────────────────────────────────────────────────────────
 
    def _actions(self, parent: tk.Widget) -> None:
        f = tk.Frame(parent, bg=BG, pady=XS)
        f.pack(fill="x", padx=PAD)
 
        # Button row — three buttons that share available width equally
        row = tk.Frame(f, bg=BG)
        row.pack(fill="x")
        row.columnconfigure(0, weight=3)   # Convert File  — widest
        row.columnconfigure(1, weight=2)   # Open Folder
        row.columnconfigure(2, weight=1)   # Clear
 
        def _make_btn(parent, text, cmd, style="primary"):
            """Flat responsive button — fills its grid cell."""
            colors = {
                "primary": (ACCENT,   "#ffffff", ACCENT_D),
                "outline": (CARD,     ACCENT,    ACCENT_L),
                "ghost":   (BG,       TXT_M,     SURFACE),
            }
            bg_n, fg_n, bg_h = colors[style]
 
            btn = tk.Label(
                parent, text=text, font=HEAD,
                bg=bg_n, fg=fg_n,
                pady=12, cursor="hand2",
                relief="flat",
            )
            if style == "outline":
                btn.configure(
                    highlightthickness=1,
                    highlightbackground=ACCENT,
                )
 
            def _enter(_): btn.configure(bg=bg_h)
            def _leave(_): btn.configure(bg=bg_n)
            def _click(_):
                if btn.cget("state") != "disabled" and cmd:
                    cmd()
 
            btn.bind("<Enter>",    _enter)
            btn.bind("<Leave>",    _leave)
            btn.bind("<Button-1>", _click)
            return btn
 
        self._conv_btn_w  = _make_btn(row, "⇄  Convert File", self._start,        "primary")
        self._folder_btn_w = _make_btn(row, "📂  Open Folder",  self._open_folder, "outline")
        self._clear_btn_w  = _make_btn(row, "✕  Clear",         self._clear,       "ghost")
 
        self._conv_btn_w.grid(  row=0, column=0, sticky="ew", padx=(0, XS), pady=2)
        self._folder_btn_w.grid(row=0, column=1, sticky="ew", padx=XS,      pady=2)
        self._clear_btn_w.grid( row=0, column=2, sticky="ew", padx=(XS, 0), pady=2)
 
        # Disabled state tracking
        self._conv_enabled   = False
        self._folder_enabled = False
        self._update_btn_states()
 
        self._spin = tk.Label(f, text="", font=SMALL, bg=BG, fg=ACCENT)
        self._spin.pack(pady=(XS, 0))
 
    # ── right pane: preview + log ─────────────────────────────────────────────
 
    def _right_pane(self, parent: tk.Widget) -> None:
        self._preview = PreviewPanel(parent)
        self._preview.frame.pack(fill="both", expand=True, pady=(0, SM))
 
        lc = card(parent, "Output Log")
        lc.pack(fill="x")
        self._log = LogBox(lc, height=8)
        self._log.frame.pack(fill="x", padx=SM, pady=XS)
        flat_btn(lc, "Clear Log", self._log.clear, fg=TXT_M).pack(
            anchor="e", padx=SM, pady=(0, XS))
 
        self._log.append("Ready — select a file to begin.", "muted")
 
    def _update_btn_states(self) -> None:
        """Sync visual state of action buttons with enable flags."""
        # Convert button
        self._conv_btn_w.configure(
            bg=ACCENT if self._conv_enabled else SURFACE,
            fg="#ffffff" if self._conv_enabled else TXT_D,
            cursor="hand2" if self._conv_enabled else "arrow",
        )
        # Open Folder button
        self._folder_btn_w.configure(
            bg=CARD if self._folder_enabled else SURFACE,
            fg=ACCENT if self._folder_enabled else TXT_D,
            cursor="hand2" if self._folder_enabled else "arrow",
            highlightbackground=ACCENT if self._folder_enabled else BORDER,
        )
 
    def _set_conv_enabled(self, v: bool) -> None:
        self._conv_enabled = v
        self._update_btn_states()
 
    def _set_folder_enabled(self, v: bool) -> None:
        self._folder_enabled = v
        self._update_btn_states()
 
    # ─────────────────────────────────────────────────────────────────────────
    # TAB 2 — BATCH
    # ─────────────────────────────────────────────────────────────────────────
 
    def _tab_batch(self, parent: tk.Widget) -> None:
        self._batch = BatchPanel(parent,
                                 on_log=self._log.append,
                                 on_done=self._on_batch_done,
                                 outdir_var=self._outdir)
        self._batch.frame.pack(fill="both", expand=True)
 
    def _on_batch_done(self) -> None:
        self._status.set("Batch complete", "success")
        self._history.refresh()
 
    # ─────────────────────────────────────────────────────────────────────────
    # TAB 3 — HISTORY
    # ─────────────────────────────────────────────────────────────────────────
 
    def _tab_history(self, parent: tk.Widget) -> None:
        self._history = HistoryPanel(parent)
        self._history.frame.pack(fill="both", expand=True)
 
    def _on_tab(self, _: tk.Event) -> None:
        if self._nb.index(self._nb.select()) == 2:
            self._history.refresh()
 
    # ── status bar ────────────────────────────────────────────────────────────
 
    def _statusbar(self, parent: tk.Widget) -> None:
        bar = tk.Frame(parent, bg=CARD, height=28,
                       highlightthickness=1, highlightbackground=BORDER)
        bar.pack(fill="x", side="bottom")
        bar.pack_propagate(False)
 
        self._status = StatusBadge(bar)
        self._status.widget.pack(side="left", padx=PAD, pady=4)
 
        tk.Label(bar, text="100% local · no data sent anywhere",
                 font=SMALL, bg=CARD, fg=TXT_D).pack(side="right", padx=PAD)
 
    # ─────────────────────────────────────────────────────────────────────────
    # SINGLE-FILE HANDLERS
    # ─────────────────────────────────────────────────────────────────────────
 
    def _browse(self) -> None:
        p = filedialog.askopenfilename(
            title="Select a file",
            filetypes=[
                ("All Supported",
                 "*.jpg *.jpeg *.png *.webp *.bmp "
                 "*.csv *.xlsx *.pdf *.docx *.doc *.mp4 *.mov *.mkv *.avi"),
                ("Images",  "*.jpg *.jpeg *.png *.webp *.bmp"),
                ("Data",    "*.csv *.xlsx"),
                ("PDF",     "*.pdf"),
                ("Word",    "*.docx *.doc"),
                ("Video",   "*.mp4 *.mov *.mkv *.avi"),
                ("All",     "*.*"),
            ],
        )
        if p: self._load(p)
 
    def _load(self, path: str) -> None:
        self._file     = path
        self._extras   = []
        self._last_out = None
        self._set_folder_enabled(False)
 
        e    = ext(path)
        name = os.path.basename(path)
        size = human_size(path)
 
        _ICONS = {
            ".jpg":"🖼",".jpeg":"🖼",".png":"🖼",".webp":"🖼",".bmp":"🖼",
            ".csv":"📊",".xlsx":"📊",".xls":"📊",
            ".pdf":"📄",".docx":"📝",".doc":"📝",
            ".mp4":"🎬",".mov":"🎬",".mkv":"🎬",".avi":"🎬",
        }
        self._f_icon.configure(text=_ICONS.get(e, "📁"), fg=ACCENT)
        self._f_name.configure(text=name, fg=TXT, font=(F, 10, "bold"))
        self._f_meta.configure(text=f"{size}  ·  {e.upper().lstrip('.')}")
 
        opts = format_options(path)
        if not opts:
            self._fmt_cb.configure(state="disabled", values=[])
            self._fmt.set("— unsupported type —")
            self._set_conv_enabled(False)
            self._log.append(f"⚠ Unsupported: {e}", "warning")
            self._status.set("Unsupported", "warning")
            return
 
        self._fmt_cb.configure(state="readonly", values=opts)
        self._fmt.set(opts[0])
        self._on_fmt()
        self._set_conv_enabled(True)
        self._draw_dz()
        self.after(60, lambda: self._preview.load(path))
        self._log.append(f"📂 {name}  ({size})", "info")
        self._status.set("File loaded", "idle")
 
    def _on_fmt(self, _: Optional[tk.Event] = None) -> None:
        """Show / hide context-sensitive option rows based on selected format."""
        ch = self._fmt.get()
        self._extra_row.pack_forget()
        self._split_panel.pack_forget()
 
        if "merge" in ch.lower():
            self._extra_row.pack(fill="x")
            self._extra_lbl.configure(text="(0 extra PDFs)")
 
        elif "split" in ch.lower():
            self._split_panel.pack(fill="x", padx=PAD, pady=XS)
 
        elif ch.lower().startswith("pdf") and self._file and not is_pdf(self._file):
            # image(s) → PDF
            self._extra_row.pack(fill="x")
            self._extra_lbl.configure(text="(0 extra images)")
 
    def _add_extras(self) -> None:
        ch = self._fmt.get()
        if "merge" in ch.lower():
            ft    = [("PDF", "*.pdf"), ("All", "*.*")]
            title = "Add PDFs to merge"
        else:
            ft    = [("Images", "*.jpg *.jpeg *.png *.webp *.bmp"), ("All", "*.*")]
            title = "Add images"
        paths = filedialog.askopenfilenames(title=title, filetypes=ft)
        if paths:
            self._extras = list(paths)
            n = len(paths)
            self._extra_lbl.configure(
                text=f"({n} file{'s' if n != 1 else ''} added)", fg=ACCENT)
            self._log.append(f"➕ {n} extra file(s) staged.", "info")
 
    def _clear(self) -> None:
        self._file = None; self._extras = []; self._last_out = None
        self._f_icon.configure(text="📁", fg=TXT_M)
        self._f_name.configure(text="No file selected", fg=TXT_M, font=BODY)
        self._f_meta.configure(text="")
        self._fmt.set("— select a file —")
        self._fmt_cb.configure(state="disabled", values=[])
        self._set_conv_enabled(False)
        self._set_folder_enabled(False)
        self._extra_row.pack_forget()
        self._split_panel.pack_forget()
        self._extra_lbl.configure(text="")
        self._ranges_var.set("")
        self._pages_var.set("")
        self._every_n_var.set("2")
        self._outdir.set("Same folder as source")
        self._spin.configure(text="")
        self._status.set("Ready", "idle")
        self._preview.clear()
        self._draw_dz()
        self._log.append("🗑 Cleared.", "muted")
 
    # ── conversion ────────────────────────────────────────────────────────────
 
    def _start(self) -> None:
        if self._converting or not self._file:
            return
 
        choice = self._fmt.get()
 
        # ── collect split params ───────────────────────────────────────────────
        split_mode     = self._split_mode.get()
        split_ranges   = None
        split_every_n  = 1
        split_odd_even = self._odd_even_var.get()
        split_pages    = None
 
        if "split" in choice.lower():
            if split_mode == "ranges":
                raw = self._ranges_var.get().strip()
                if not raw:
                    messagebox.showwarning(
                        "Missing ranges",
                        "Enter page ranges, e.g.  1-3, 5, 7-9\n\n"
                        "Or choose a different split mode."
                    )
                    return
                try:
                    split_ranges = parse_ranges(raw)
                except ValueError as e:
                    messagebox.showerror("Bad ranges", str(e))
                    return
 
            elif split_mode == "every_n":
                try:
                    split_every_n = int(self._every_n_var.get())
                    if split_every_n < 1:
                        raise ValueError
                except ValueError:
                    messagebox.showerror("Bad value", "Every N must be a number ≥ 1.")
                    return
 
            elif split_mode == "pages":
                raw = self._pages_var.get().strip()
                if not raw:
                    messagebox.showwarning(
                        "Missing pages",
                        "Enter the page numbers you want, e.g.  2, 5, 8"
                    )
                    return
                try:
                    split_pages = parse_pages(raw)
                except ValueError as e:
                    messagebox.showerror("Bad pages", str(e))
                    return
 
        # ── resolve output dir ─────────────────────────────────────────────────
        od = self._outdir.get().strip()
        output_dir: Optional[str] = None if od in ("", "Same folder as source") else od
 
        self._set_loading(True)
        self._log.append("─" * 44, "muted")
        self._log.append(f"▶ {os.path.basename(self._file)}  →  {choice}", "info")
 
        threading.Thread(
            target=self._worker,
            args=(
                self._file, choice, list(self._extras),
                split_mode, split_ranges, split_every_n,
                split_odd_even, split_pages, output_dir,
            ),
            daemon=True,
        ).start()
 
    def _worker(self, path, choice, extras,
                split_mode, split_ranges, split_every_n,
                split_odd_even, split_pages, outdir) -> None:
        try:
            result = dispatch(
                input_path     = path,
                format_choice  = choice,
                extra_files    = extras,
                split_mode     = split_mode,
                split_ranges   = split_ranges,
                split_every_n  = split_every_n,
                split_odd_even = split_odd_even,
                split_pages    = split_pages,
                output_dir     = outdir,
            )
            self.after(0, self._ok, path, choice, result)
        except Exception as e:
            log.error("worker | %s", e, exc_info=True)
            self.after(0, self._err, path, choice, str(e))
 
    def _ok(self, path, choice, result) -> None:
        self._set_loading(False)
        self._last_out = result
        self._set_folder_enabled(True)
        if isinstance(result, list):
            self._log.append(f"✅ Done — {len(result)} file(s):", "success")
            for r in result:
                self._log.append(f"   → {r}", "success")
        else:
            self._log.append("✅ Saved:", "success")
            self._log.append(f"   → {result}", "success")
        self._status.set("Done ✓", "success")
        hist.save(path, result, choice, success=True)
        self._history.refresh()
 
    def _err(self, path, choice, msg) -> None:
        self._set_loading(False)
        self._log.append(f"❌ {msg}", "error")
        self._status.set("Failed", "error")
        hist.save(path, "", choice, success=False)
        messagebox.showerror("Conversion Failed", f"Error:\n\n{msg}")
 
    def _set_loading(self, on: bool) -> None:
        self._converting = on
        self._set_conv_enabled(not on)
        if on:
            self._status.set("Converting…", "running")
            self._spin.configure(text="⟳  Converting…")
            self._tick()
        else:
            self._spin.configure(text="")
 
    _FRAMES = ("⟳  Converting.  ", "⟳  Converting.. ", "⟳  Converting...")
 
    def _tick(self) -> None:
        if not self._converting: return
        self._spin.configure(text=self._FRAMES[self._spin_idx % 3])
        self._spin_idx += 1
        self.after(400, self._tick)
 
    def _open_folder(self) -> None:
        if not self._last_out: return
        p      = self._last_out[0] if isinstance(self._last_out, list) else self._last_out
        folder = os.path.dirname(p)
        try:
            if sys.platform == "win32":   os.startfile(folder)
            elif sys.platform == "darwin": subprocess.Popen(["open", folder])
            else:                          subprocess.Popen(["xdg-open", folder])
        except Exception as e:
            log.warning("open_folder | %s", e)

