import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

SYSTEM_PROMPT = """You are a security anomaly detector for a data vault system.
Given an access event, decide if it is suspicious.
Reply ONLY with valid JSON in this exact format:
{"flagged": true/false, "risk_score": 0.0-1.0, "reason": "short reason"}"""

def analyze_event(user: str, action: str, entities: list, hour: int) -> dict:
    event_desc = f"""
User: {user}
Action: {action}
Entities accessed: {', '.join(entities)}
Hour of day: {hour}:00
"""
    payload = {
        "model":  "phi3",
        "prompt": f"{SYSTEM_PROMPT}\n\nEvent:\n{event_desc}",
        "stream": False
    }
    try:
        resp = requests.post(OLLAMA_URL, json=payload, timeout=30)
        raw = resp.json()["response"].strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)
    except Exception as e:
        return {"flagged": False, "risk_score": 0.0, "reason": f"analysis failed: {e}"}