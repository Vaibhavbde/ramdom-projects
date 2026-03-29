"""gui/components/theme.py — all design tokens in one place."""

# ── Palette ───────────────────────────────────────────────────────────────────
BG         = "#EEF2F7"    # window background
CARD       = "#FFFFFF"    # card/panel background
SURFACE    = "#F4F6FA"    # inputs, alt rows
HOVER      = "#E8F0FE"    # hover highlight

ACCENT     = "#2563EB"    # primary blue
ACCENT_D   = "#1D4ED8"    # darker blue (pressed)
ACCENT_L   = "#DBEAFE"    # light blue tint

OK         = "#16A34A"    # green
OK_BG      = "#F0FDF4"
WARN       = "#D97706"    # amber
WARN_BG    = "#FFFBEB"
ERR        = "#DC2626"    # red
ERR_BG     = "#FEF2F2"
RUN_BG     = "#EFF6FF"

TXT        = "#1E293B"    # body text
TXT_H      = "#0F172A"    # headings
TXT_M      = "#64748B"    # muted / secondary
TXT_D      = "#94A3B8"    # disabled

BORDER     = "#E2E8F0"    # default border

# ── Typography ────────────────────────────────────────────────────────────────
F          = "Segoe UI"
F_MONO     = "Consolas"

TITLE      = (F, 20, "bold")
SUBTITLE   = (F, 10)
HEAD       = (F, 11, "bold")
BODY       = (F, 10)
SMALL      = (F, 9)
LOG        = (F_MONO, 9)

# ── Spacing ───────────────────────────────────────────────────────────────────
PAD   = 20
SM    = 10
XS    = 5

# ── Window ────────────────────────────────────────────────────────────────────
W, H       = 1_020, 720
MIN_W      = 820
MIN_H      = 580
