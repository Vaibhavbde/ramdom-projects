from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from detector import detect, load_model
from masker import mask, regex_entities
from consent import (
    grant_consent, revoke_consent, get_consent,
    list_all_consent, consent_audit_log, check_permission,
    LEVEL_MASK, LEVEL_LABELS
)
import io

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str
    mode: Optional[str] = "smart"   # smart or generic
    user_id: Optional[str] = "anonymous"

class ConsentGrantRequest(BaseModel):
    user_id: str
    level: int                       # 0=none 1=mask_only 2=mask_and_store 3=full
    note: Optional[str] = ""

class ConsentRevokeRequest(BaseModel):
    user_id: str

@app.on_event("startup")
def startup():
    load_model()

# ── existing endpoints (unchanged behaviour, consent check added) ─────────────

@app.options("/analyze")
def options_analyze():
    return {}

@app.post("/analyze")
def analyze(inp: TextInput):
    # Layer 3 consent gate
    allowed, reason = check_permission(inp.user_id, LEVEL_MASK)
    if not allowed:
        raise HTTPException(status_code=403, detail=f"[Layer 3] {reason}")

    entities     = detect(inp.text)
    regex_ents   = regex_entities(inp.text)
    all_entities = entities + regex_ents
    masked       = mask(inp.text, all_entities, mode=inp.mode)
    return {
        "original": inp.text,
        "masked":   masked,
        "entities": all_entities,
        "mode":     inp.mode,
        "consent_level": get_consent(inp.user_id)["level_label"],
    }

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    mode: str = "smart",
    user_id: str = "anonymous",
):
    # Layer 3 consent gate
    allowed, reason = check_permission(user_id, LEVEL_MASK)
    if not allowed:
        raise HTTPException(status_code=403, detail=f"[Layer 3] {reason}")

    content = await file.read()
    if file.filename.endswith((".txt", ".csv")):
        text = content.decode("utf-8", errors="ignore")
    elif file.filename.endswith(".pdf"):
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content))
            text = "\n".join(p.extract_text() or "" for p in reader.pages)
        except Exception as e:
            return {"error": f"PDF read failed: {e}"}
    else:
        return {"error": "unsupported file type"}

    entities     = detect(text)
    regex_ents   = regex_entities(text)
    all_entities = entities + regex_ents
    masked       = mask(text, all_entities, mode=mode)
    return {
        "filename": file.filename,
        "original": text[:500] + "..." if len(text) > 500 else text,
        "masked":   masked[:500] + "..." if len(masked) > 500 else masked,
        "entities": all_entities,
        "mode":     mode,
        "consent_level": get_consent(user_id)["level_label"],
    }

@app.get("/health")
def health():
    return {"status": "ok", "layers": ["L1", "L3"]}

# ── Layer 3: consent endpoints (new) ─────────────────────────────────────────

@app.post("/consent/grant")
def consent_grant(req: ConsentGrantRequest):
    if req.level not in LEVEL_LABELS:
        raise HTTPException(status_code=400, detail=f"Invalid level. Use: {list(LEVEL_LABELS.keys())}")
    record = grant_consent(req.user_id, req.level, req.note)
    return {"status": "granted", "consent": record}

@app.post("/consent/revoke")
def consent_revoke(req: ConsentRevokeRequest):
    record = revoke_consent(req.user_id)
    return {"status": "revoked", "consent": record}

@app.get("/consent/{user_id}")
def consent_get(user_id: str):
    record = get_consent(user_id)
    if not record:
        return {"user_id": user_id, "level": None, "message": "No record found"}
    return record

@app.get("/consent")
def consent_list(limit: int = 100):
    return {"consents": list_all_consent(limit)}

@app.get("/audit")
def audit_log(limit: int = 30):
    """Combined audit for dashboard — always has data even if anomaly is down."""
    entries = []
    for e in consent_audit_log(limit=limit):
        entries.append({
            "ts":      e["ts"],
            "source":  "consent",
            "user_id": e["user_id"],
            "action":  e["action"],
            "detail":  f"Consent {e['action']} → level={e['level_label']}",
        })
    entries.sort(key=lambda x: x["ts"], reverse=True)
    return {"entries": entries, "count": len(entries)}