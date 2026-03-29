"""
gui/components/widgets.py
=========================
Reusable UI components — pure Tkinter, no ttkbootstrap subclassing.

Components
----------
flat_btn(parent, ...)       → tk.Button  (styled factory, no subclass)
pill_canvas_btn(parent, ...) → tk.Canvas (rounded button drawn on canvas)
StatusBadge                 → tk.Label   (coloured pill)
LogBox                      → tk.Frame   (scrollable log)
sep(parent)                 → tk.Frame   (horizontal separator)
card(parent, title)         → tk.LabelFrame
"""
from __future__ import annotations
import tkinter as tk
from tkinter import ttk
from typing import Callable, Optional

from gui.components.theme import (
    ACCENT, ACCENT_D, ACCENT_L, BG, BORDER, CARD, SURFACE,
    ERR, ERR_BG, HEAD, LOG, OK, OK_BG, RUN_BG,
    SMALL, BODY, TXT, TXT_D, TXT_H, TXT_M,
    WARN, WARN_BG, PAD, SM, XS,
)


# ── Factory: plain flat button ────────────────────────────────────────────────
# Use this instead of subclassing — avoids the ttkbootstrap wrapping bug.

def flat_btn(
    parent: tk.Widget,
    text: str,
    command: Optional[Callable] = None,
    fg:  str = ACCENT,
    bg:  str = SURFACE,
    font=SMALL,
    padx: int = 10,
    pady: int = 4,
) -> tk.Button:
    """Return a simple styled tk.Button."""
    btn = tk.Button(
        parent, text=text, command=command,
        font=font, fg=fg, bg=bg,
        relief="flat", bd=0, cursor="hand2",
        activeforeground=fg, activebackground=ACCENT_L,
        padx=padx, pady=pady,
    )
    return btn


# ── Rounded canvas button ─────────────────────────────────────────────────────

class RoundBtn:
    """
    A rounded-rectangle button drawn on a tk.Canvas.
    Avoids ALL subclassing — the public attribute is `.widget` (the canvas).

    Usage
    -----
        b = RoundBtn(parent, "Convert ⇄", command=fn)
        b.widget.pack(...)
        b.set_enabled(False)
    """

    _THEMES = {
        "primary": dict(
            normal=(ACCENT,   "#fff", ACCENT),
            hover =(ACCENT_D, "#fff", ACCENT_D),
        ),
        "outline": dict(
            normal=(CARD,    ACCENT, ACCENT),
            hover =(ACCENT_L, ACCENT, ACCENT),
        ),
        "ghost": dict(
            normal=(BG,    TXT_M, BG),
            hover =(ACCENT_L, ACCENT, ACCENT_L),
        ),
    }

    def __init__(
        self,
        parent: tk.Widget,
        text: str,
        command: Optional[Callable] = None,
        style:   str = "primary",
        w: int = 180,
        h: int = 40,
        parent_bg: str = BG,
    ) -> None:
        self._text    = text
        self._cmd     = command
        self._style   = style
        self._enabled = True
        self._w       = w
        self._h       = h
        self._pbg     = parent_bg

        # The actual widget — no subclassing
        self.widget = tk.Canvas(
            parent,
            width=w, height=h,
            highlightthickness=0,
            bg=parent_bg,
            cursor="hand2",
        )

        self._draw()
        self.widget.bind("<Enter>",           lambda _: self._on_enter())
        self.widget.bind("<Leave>",           lambda _: self._on_leave())
        self.widget.bind("<ButtonPress-1>",   lambda _: self._on_press())
        self.widget.bind("<ButtonRelease-1>", lambda _: self._on_release())

    # ── Public ─────────────────────────────────────────────────────────────────

    def set_enabled(self, v: bool) -> None:
        self._enabled = v
        self.widget.configure(cursor="hand2" if v else "arrow")
        self._draw()

    def set_text(self, t: str) -> None:
        self._text = t
        self._draw()

    # ── Internals ──────────────────────────────────────────────────────────────

    def _draw(self, variant: str = "normal") -> None:
        c = self.widget
        c.delete("all")
        w, h, r = self._w, self._h, 8

        if not self._enabled:
            bg, fg, outline = SURFACE, TXT_D, BORDER
        else:
            bg, fg, outline = self._THEMES[self._style][variant]

        # Rounded rectangle via polygon
        pts = [r,0, w-r,0, w,0, w,r, w,h-r, w,h, w-r,h, r,h, 0,h, 0,h-r, 0,r, 0,0]
        bw  = 1 if self._style == "outline" else 0
        c.create_polygon(pts, smooth=True, fill=bg, outline=outline, width=bw)
        c.create_text(w//2, h//2, text=self._text, fill=fg,
                      font=HEAD, anchor="center")

    def _on_enter(self) -> None:
        if self._enabled: self._draw("hover")

    def _on_leave(self) -> None:
        if self._enabled: self._draw("normal")

    def _on_press(self) -> None:
        if self._enabled: self._draw("hover")

    def _on_release(self) -> None:
        if self._enabled:
            self._draw("normal")
            if self._cmd:
                self._cmd()


# ── StatusBadge ───────────────────────────────────────────────────────────────

_BADGE = {
    "idle":    (TXT_M,  SURFACE),
    "success": (OK,     OK_BG),
    "error":   (ERR,    ERR_BG),
    "warning": (WARN,   WARN_BG),
    "running": (ACCENT, RUN_BG),
}


class StatusBadge:
    """Pill-shaped label for conversion status."""

    def __init__(self, parent: tk.Widget, bg: str = CARD) -> None:
        self.widget = tk.Label(
            parent, text="Ready",
            font=SMALL, padx=10, pady=3,
            relief="flat", bd=0,
            fg=TXT_M, bg=SURFACE,
        )

    def set(self, text: str, kind: str = "idle") -> None:
        fg, bg = _BADGE.get(kind, _BADGE["idle"])
        self.widget.configure(text=text, fg=fg, bg=bg)


# ── LogBox ────────────────────────────────────────────────────────────────────

_LOG_COLORS = {
    "info":    TXT,
    "success": OK,
    "error":   ERR,
    "warning": WARN,
    "muted":   TXT_M,
}


class LogBox:
    """Scrollable read-only log panel."""

    def __init__(self, parent: tk.Widget, height: int = 8) -> None:
        self.frame = tk.Frame(parent, bg=SURFACE)
        self._txt  = tk.Text(
            self.frame, height=height, font=LOG,
            bg=SURFACE, fg=TXT,
            relief="flat", bd=0, wrap="word",
            state="disabled",
            selectbackground=ACCENT_L,
            padx=SM, pady=SM,
        )
        sb = ttk.Scrollbar(self.frame, orient="vertical", command=self._txt.yview)
        self._txt.configure(yscrollcommand=sb.set)

        for tag, color in _LOG_COLORS.items():
            self._txt.tag_configure(tag, foreground=color)

        self._txt.pack(side="left", fill="both", expand=True)
        sb.pack(side="right", fill="y")

    def append(self, msg: str, kind: str = "info") -> None:
        self._txt.configure(state="normal")
        self._txt.insert("end", msg + "\n", kind)
        self._txt.configure(state="disabled")
        self._txt.see("end")

    def clear(self) -> None:
        self._txt.configure(state="normal")
        self._txt.delete("1.0", "end")
        self._txt.configure(state="disabled")


# ── Helpers ───────────────────────────────────────────────────────────────────

def sep(parent: tk.Widget, color: str = BORDER) -> tk.Frame:
    """Return a 1-pixel horizontal separator."""
    return tk.Frame(parent, height=1, bg=color)


def card(parent: tk.Widget, title: str = "", bg: str = CARD) -> tk.LabelFrame:
    """Return a styled LabelFrame card."""
    return tk.LabelFrame(
        parent,
        text=f"  {title}  " if title else "",
        font=HEAD, bg=bg, fg=TXT_H,
        padx=0, pady=XS,
        relief="flat",
        highlightbackground=BORDER,
        highlightthickness=1,
    )


def scrolled_frame(
    parent: tk.Widget,
    bg: str = SURFACE,
) -> tuple[tk.Canvas, tk.Frame]:
    """
    Return (canvas, inner_frame).
    Pack/grid the canvas, add widgets to inner_frame.
    """
    canvas = tk.Canvas(parent, bg=bg, highlightthickness=0)
    sb     = ttk.Scrollbar(parent, orient="vertical", command=canvas.yview)
    canvas.configure(yscrollcommand=sb.set)
    sb.pack(side="right", fill="y")
    canvas.pack(side="left", fill="both", expand=True)

    inner = tk.Frame(canvas, bg=bg)
    win   = canvas.create_window((0, 0), window=inner, anchor="nw")

    inner.bind(
        "<Configure>",
        lambda e: canvas.configure(scrollregion=canvas.bbox("all")),
    )
    canvas.bind(
        "<Configure>",
        lambda e: canvas.itemconfig(win, width=e.width),
    )
    return canvas, inner
