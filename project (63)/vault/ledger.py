import json
import hashlib
import time
import os

LEDGER_FILE = "ledger.json"

def _load() -> list:
    if not os.path.exists(LEDGER_FILE):
        return []
    with open(LEDGER_FILE, "r") as f:
        return json.load(f)

def _save(chain: list):
    with open(LEDGER_FILE, "w") as f:
        json.dump(chain, f, indent=2)

def _hash(block: dict) -> str:
    block_str = json.dumps(block, sort_keys=True).encode()
    return hashlib.sha256(block_str).hexdigest()

def add_entry(action: str, user: str, data_summary: str) -> dict:
    chain = _load()
    prev_hash = chain[-1]["hash"] if chain else "0" * 64
    block = {
        "index":        len(chain),
        "timestamp":    time.time(),
        "action":       action,
        "user":         user,
        "data_summary": data_summary,
        "prev_hash":    prev_hash,
    }
    block["hash"] = _hash(block)
    chain.append(block)
    _save(chain)
    return block

def get_chain() -> list:
    return _load()

def verify_chain() -> bool:
    chain = _load()
    for i in range(1, len(chain)):
        if chain[i]["prev_hash"] != chain[i-1]["hash"]:
            return False
    return True
