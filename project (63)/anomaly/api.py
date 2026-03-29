from fastapi import FastAPI
from pydantic import BaseModel
from audit import init_db, log_event, get_logs
from detector import analyze_event
from datetime import datetime

app = FastAPI()

class EventInput(BaseModel):
    user: str
    action: str
    entities: list
    hour: int = None

@app.on_event("startup")
def startup():
    init_db()

@app.post("/analyze")
def analyze(evt: EventInput):
    hour = evt.hour if evt.hour is not None else datetime.now().hour
    result = analyze_event(evt.user, evt.action, evt.entities, hour)
    
    log_event(
        user    = evt.user,
        action  = evt.action,
        entity  = ", ".join(evt.entities),
        flagged = result.get("flagged", False),
        reason  = result.get("reason", "")
    )
    
    return {
        "user":       evt.user,
        "action":     evt.action,
        "flagged":    result.get("flagged", False),
        "risk_score": result.get("risk_score", 0.0),
        "reason":     result.get("reason", "")
    }

@app.get("/audit")
def get_audit(limit: int = 20):
    import sqlite3, os
    db_path = os.path.join(os.path.dirname(__file__), "audit.db")
    if not os.path.exists(db_path):
        return {"entries": [], "count": 0}
    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?", (limit,)
    ).fetchall()
    con.close()
    entries = [dict(r) for r in rows]
    return {
        "entries": [
            {
                "ts":     e.get("timestamp", e.get("ts", 0)),
                "source": "anomaly",
                "action": e.get("event_type", e.get("action", "access")),
                "detail": e.get("user_id", e.get("detail", "")),
            }
            for e in entries
        ],
        "count": len(entries)
    }

@app.get("/logs")
def logs():
    return get_logs()

@app.get("/health")
def health():
    return {"status": "ok"}