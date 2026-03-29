from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from crypto import generate_key, encrypt, decrypt
from ledger import add_entry, get_chain, verify_chain
from shamir import split_key, recover_key
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_keys = {}

class EncryptRequest(BaseModel):
    user: str
    data: str

class DecryptRequest(BaseModel):
    user: str
    iv: str
    ciphertext: str

class RecoverRequest(BaseModel):
    shares: list

@app.post("/encrypt")
def encrypt_data(req: EncryptRequest):
    key = generate_key()
    encrypted = encrypt(req.data, key)
    shares = split_key(key)
    _keys[req.user] = key
    add_entry("ENCRYPT", req.user, f"encrypted {len(req.data)} chars")
    return {
        "iv":         encrypted["iv"],
        "ciphertext": encrypted["ciphertext"],
        "shares":     [{"x": s[0], "y": s[1]} for s in shares],
        "message":    "store shares separately, need 3 of 5 to recover"
    }

@app.post("/decrypt")
def decrypt_data(req: DecryptRequest):
    if req.user not in _keys:
        raise HTTPException(status_code=403, detail="unauthorized")
    key = _keys[req.user]
    plaintext = decrypt(req.iv, req.ciphertext, key)
    add_entry("DECRYPT", req.user, f"decrypted successfully")
    return {"plaintext": plaintext}

@app.post("/recover")
def recover(req: RecoverRequest):
    if len(req.shares) < 3:
        raise HTTPException(status_code=400, detail="need at least 3 shares")
    shares = [(s["x"], s["y"]) for s in req.shares]
    key = recover_key(shares)
    return {"key": key.hex(), "message": "key recovered successfully"}

@app.get("/ledger")
def ledger():
    return {
        "chain": get_chain(),
        "valid": verify_chain()
    }

@app.get("/health")
def health():
    return {"status": "ok"}
