import sqlite3
import time
import os

DB = "audit.db"

def init_db():
    conn = sqlite3.connect(DB)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS audit_log (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp REAL,
            user      TEXT,
            action    TEXT,
            entity    TEXT,
            flagged   INTEGER,
            reason    TEXT
        )
    """)
    conn.commit()
    conn.close()

def log_event(user: str, action: str, entity: str, flagged: bool, reason: str = ""):
    conn = sqlite3.connect(DB)
    conn.execute(
        "INSERT INTO audit_log VALUES (NULL,?,?,?,?,?,?)",
        (time.time(), user, action, entity, int(flagged), reason)
    )
    conn.commit()
    conn.close()

def get_logs() -> list:
    conn = sqlite3.connect(DB)
    rows = conn.execute(
        "SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 100"
    ).fetchall()
    conn.close()
    return [
        {
            "id":        r[0],
            "timestamp": r[1],
            "user":      r[2],
            "action":    r[3],
            "entity":    r[4],
            "flagged":   bool(r[5]),
            "reason":    r[6]
        }
        for r in rows
    ]