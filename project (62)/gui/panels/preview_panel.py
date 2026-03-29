"""gui/panels/preview_panel.py — contextual file preview."""
from __future__ import annotations
import os
import tkinter as tk
from tkinter import ttk
from typing import Optional

from gui.components.theme import *
from gui.components.widgets import card, scrolled_frame
from core.utils.paths import ext, human_size, is_data, is_docx, is_image, is_pdf


class PreviewPanel:
    def __init__(self, parent: tk.Widget) -> None:
        self.frame = card(parent, "Preview")
        self._photo = None  # keep PhotoImage alive

        hdr = tk.Frame(self.frame, bg=CARD)
        hdr.pack(fill="x", padx=SM, pady=XS)
        tk.Label(hdr, text="Preview", font=HEAD, bg=CARD, fg=TXT_H).pack(side="left")
        self._badge = tk.Label(hdr, text="", font=SMALL, bg=ACCENT_L, fg=ACCENT, padx=8, pady=2)
        self._badge.pack(side="left", padx=SM)

        self._body = tk.Frame(
            self.frame, bg=SURFACE,
            highlightthickness=1, highlightbackground=BORDER,
        )
        self._body.pack(fill="both", expand=True, padx=SM, pady=(0, SM))
        self._show_empty()

    def clear(self) -> None:
        self._badge.configure(text="")
        self._wipe()
        self._show_empty()

    def load(self, path: str) -> None:
        self._badge.configure(text=ext(path).upper().lstrip("."))
        try:
            if is_image(path):   self._image(path)
            elif is_data(path):  self._table(path)
            elif is_pdf(path):   self._pdf(path)
            elif is_docx(path):  self._docx(path)
            else:                self._generic(path)
        except Exception as e:
            self._err(str(e))

    # ── renderers ─────────────────────────────────────────────────────────────

    def _image(self, path: str) -> None:
        from PIL import Image, ImageTk
        self._wipe()
        with Image.open(path) as img:
            w0, h0, mode = img.size[0], img.size[1], img.mode
            thumb = img.copy()
            thumb.thumbnail((310, 220), Image.LANCZOS)
            self._photo = ImageTk.PhotoImage(thumb)
        c = tk.Canvas(self._body, bg=SURFACE, highlightthickness=0, width=310, height=220)
        c.pack(pady=SM)
        c.create_image(155, 110, image=self._photo, anchor="center")
        m = tk.Frame(self._body, bg=SURFACE)
        m.pack(fill="x", padx=SM, pady=(0, SM))
        self._row(m, "Dimensions", f"{w0} × {h0} px")
        self._row(m, "Mode",       mode)
        self._row(m, "Size",       human_size(path))

    def _table(self, path: str) -> None:
        import pandas as pd
        self._wipe()
        df = pd.read_csv(path, nrows=10, encoding="utf-8-sig") if ext(path) == ".csv" \
             else pd.read_excel(path, nrows=10, engine="openpyxl")
        tk.Label(self._body, text=f"First {len(df)} rows · {len(df.columns)} cols",
                 font=SMALL, bg=SURFACE, fg=TXT_M).pack(pady=4)
        wrap = tk.Frame(self._body, bg=SURFACE)
        wrap.pack(fill="both", expand=True, padx=SM, pady=XS)
        hs = ttk.Scrollbar(wrap, orient="horizontal")
        vs = ttk.Scrollbar(wrap, orient="vertical")
        tv = ttk.Treeview(wrap, columns=list(df.columns), show="headings",
                          yscrollcommand=vs.set, xscrollcommand=hs.set,
                          height=min(len(df), 8))
        hs.configure(command=tv.xview); vs.configure(command=tv.yview)
        hs.pack(side="bottom", fill="x"); vs.pack(side="right", fill="y")
        tv.pack(side="left", fill="both", expand=True)
        for col in df.columns:
            tv.heading(col, text=str(col))
            tv.column(col, width=90, minwidth=50)
        for _, row in df.iterrows():
            tv.insert("", "end", values=list(row))
        m = tk.Frame(self._body, bg=SURFACE)
        m.pack(fill="x", padx=SM, pady=XS)
        self._row(m, "File size", human_size(path))

    def _pdf(self, path: str) -> None:
        import PyPDF2
        self._wipe()
        r = PyPDF2.PdfReader(path)
        n = len(r.pages)
        meta = r.metadata or {}
        ring = tk.Canvas(self._body, width=80, height=80, bg=SURFACE, highlightthickness=0)
        ring.pack(pady=(SM, 0))
        ring.create_oval(5, 5, 75, 75, fill=ACCENT_L, outline=ACCENT, width=2)
        ring.create_text(40, 32, text=str(n), font=(F, 22, "bold"), fill=ACCENT)
        ring.create_text(40, 56, text="pages", font=SMALL, fill=TXT_M)
        m = tk.Frame(self._body, bg=SURFACE)
        m.pack(fill="x", padx=PAD, pady=SM)
        self._row(m, "Title",     str(meta.get("/Title",  "—"))[:50])
        self._row(m, "Author",    str(meta.get("/Author", "—"))[:50])
        self._row(m, "Encrypted", "Yes" if r.is_encrypted else "No")
        self._row(m, "Size",      human_size(path))

    def _docx(self, path: str) -> None:
        import zipfile, xml.etree.ElementTree as ET
        self._wipe()
        words = paras = 0
        try:
            with zipfile.ZipFile(path) as zf:
                if "word/document.xml" in zf.namelist():
                    ns  = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
                    root = ET.fromstring(zf.read("word/document.xml"))
                    ps  = root.findall(".//w:p", ns)
                    paras = len(ps)
                    for p in ps:
                        words += sum(len(t.text.split()) for t in p.findall(".//w:t", ns) if t.text)
        except Exception:
            pass
        ic = tk.Canvas(self._body, width=70, height=70, bg=SURFACE, highlightthickness=0)
        ic.pack(pady=SM)
        ic.create_rectangle(8, 5, 62, 65, fill="#2B579A", outline="")
        ic.create_text(35, 35, text="W", font=(F, 26, "bold"), fill="#fff")
        m = tk.Frame(self._body, bg=SURFACE)
        m.pack(fill="x", padx=PAD, pady=SM)
        self._row(m, "Paragraphs", f"~{paras:,}")
        self._row(m, "Words",      f"~{words:,}")
        self._row(m, "Size",       human_size(path))

    def _generic(self, path: str) -> None:
        self._wipe()
        m = tk.Frame(self._body, bg=SURFACE)
        m.pack(fill="both", expand=True, padx=PAD, pady=PAD)
        self._row(m, "Name",      os.path.basename(path))
        self._row(m, "Extension", ext(path))
        self._row(m, "Size",      human_size(path))
        self._row(m, "Location",  os.path.dirname(path))

    def _err(self, msg: str) -> None:
        self._wipe()
        tk.Label(self._body, text=f"⚠  Preview unavailable\n{msg[:120]}",
                 font=SMALL, bg=SURFACE, fg=TXT_M,
                 justify="center", wraplength=280, pady=30).pack(expand=True)

    def _show_empty(self) -> None:
        self._wipe()
        tk.Label(self._body, text="Select a file\nto see a preview",
                 font=BODY, bg=SURFACE, fg=TXT_M,
                 justify="center", pady=50).pack(expand=True)

    # ── helpers ───────────────────────────────────────────────────────────────

    def _wipe(self) -> None:
        for w in self._body.winfo_children():
            w.destroy()
        self._photo = None

    @staticmethod
    def _row(parent: tk.Frame, label: str, value: str) -> None:
        r = tk.Frame(parent, bg=parent["bg"], pady=2)
        r.pack(fill="x")
        tk.Label(r, text=f"{label}:", font=SMALL, bg=parent["bg"],
                 fg=TXT_M, width=12, anchor="w").pack(side="left")
        tk.Label(r, text=value, font=SMALL, bg=parent["bg"],
                 fg=TXT, anchor="w").pack(side="left")
