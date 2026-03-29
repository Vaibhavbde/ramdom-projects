"""
Layer 3 — Consent Management Middleware
Tracks user permissions for data usage before masking runs.
Stored in SQLite: consent.db (local to detector/)
"""

import sqlite3
import time
from pathlib import Path
from typing import Optional

DB_PATH = Path(__file__).parent / "consent.db"

# Permission levels
LEVEL_NONE    = 0   # No consent given — block all processing
LEVEL_MASK    = 1   # Consent to detect + mask only
LEVEL_STORE   = 2   # Consent to detect, mask, and store in vault
LEVEL_FULL    = 3   # Full consent — masking, storage, anomaly analysis

LEVEL_LABELS = {
    LEVEL_NONE:  "none",
    LEVEL_MASK:  "mask_only",
    LEVEL_STORE: "mask_and_store",
    LEVEL_FULL:  "full",
}

def _conn():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

def init_db():
    with _conn() as con:
        con.execute("""
            CREATE TABLE IF NOT EXISTS consent (
                user_id     TEXT PRIMARY KEY,
                level       INTEGER NOT NULL DEFAULT 1,
                granted_at  REAL NOT NULL,
                updated_at  REAL NOT NULL,
                note        TEXT
            )
        """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS consent_log (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id     TEXT NOT NULL,
                action      TEXT NOT NULL,
                level       INTEGER NOT NULL,
                ts          REAL NOT NULL
            )
        """)

def grant_consent(user_id: str, level: int, note: str = "") -> dict:
    """Grant or update consent for a user."""
    now = time.time()
    with _conn() as con:
        con.execute("""
            INSERT INTO consent (user_id, level, granted_at, updated_at, note)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                level=excluded.level,
                updated_at=excluded.updated_at,
                note=excluded.note
        """, (user_id, level, now, now, note))
        con.execute("""
            INSERT INTO consent_log (user_id, action, level, ts)
            VALUES (?, 'grant', ?, ?)
        """, (user_id, level, now))
    return get_consent(user_id)

def revoke_consent(user_id: str) -> dict:
    """Revoke consent for a user (sets level to NONE)."""
    now = time.time()
    with _conn() as con:
        con.execute("""
            UPDATE consent SET level=0, updated_at=? WHERE user_id=?
        """, (now, user_id))
        con.execute("""
            INSERT INTO consent_log (user_id, action, level, ts)
            VALUES (?, 'revoke', 0, ?)
        """, (user_id, now))
    return get_consent(user_id)

def get_consent(user_id: str) -> Optional[dict]:
    """Return consent record for a user, or None if never set."""
    with _conn() as con:
        row = con.execute(
            "SELECT * FROM consent WHERE user_id=?", (user_id,)
        ).fetchone()
    if not row:
        return None
    return {
        "user_id": row["user_id"],
        "level": row["level"],
        "level_label": LEVEL_LABELS.get(row["level"], "unknown"),
        "granted_at": row["granted_at"],
        "updated_at": row["updated_at"],
        "note": row["note"],
    }

def check_permission(user_id: str, required_level: int) -> tuple[bool, str]:
    """
    Returns (allowed: bool, reason: str).
    If user has no record, default to MASK_ONLY (level 1) for hackathon demo.
    """
    record = get_consent(user_id)
    if record is None:
        # Auto-grant mask_only for new users in demo mode
        grant_consent(user_id, LEVEL_MASK, note="auto-granted (demo mode)")
        record = get_consent(user_id)

    if record["level"] >= required_level:
        return True, f"Permitted (level={LEVEL_LABELS[record['level']]})"
    return False, (
        f"Insufficient consent: user '{user_id}' has level "
        f"'{LEVEL_LABELS[record['level']]}', required "
        f"'{LEVEL_LABELS.get(required_level, str(required_level))}'"
    )

def list_all_consent(limit: int = 100) -> list[dict]:
    with _conn() as con:
        rows = con.execute(
            "SELECT * FROM consent ORDER BY updated_at DESC LIMIT ?", (limit,)
        ).fetchall()
    return [
        {
            "user_id": r["user_id"],
            "level": r["level"],
            "level_label": LEVEL_LABELS.get(r["level"], "unknown"),
            "granted_at": r["granted_at"],
            "updated_at": r["updated_at"],
            "note": r["note"],
        }
        for r in rows
    ]

def consent_audit_log(user_id: str = None, limit: int = 50) -> list[dict]:
    with _conn() as con:
        if user_id:
            rows = con.execute(
                "SELECT * FROM consent_log WHERE user_id=? ORDER BY ts DESC LIMIT ?",
                (user_id, limit)
            ).fetchall()
        else:
            rows = con.execute(
                "SELECT * FROM consent_log ORDER BY ts DESC LIMIT ?", (limit,)
            ).fetchall()
    return [
        {
            "id": r["id"],
            "user_id": r["user_id"],
            "action": r["action"],
            "level": r["level"],
            "level_label": LEVEL_LABELS.get(r["level"], "unknown"),
            "ts": r["ts"],
        }
        for r in rows
    ]

# Init DB on import
init_db()
