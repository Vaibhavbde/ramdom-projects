from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import base64
import json

def generate_key() -> bytes:
    return get_random_bytes(32)  # AES-256

def encrypt(data: str, key: bytes) -> dict:
    iv = get_random_bytes(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    ct = cipher.encrypt(pad(data.encode(), AES.block_size))
    return {
        "iv":         base64.b64encode(iv).decode(),
        "ciphertext": base64.b64encode(ct).decode()
    }

def decrypt(iv_b64: str, ct_b64: str, key: bytes) -> str:
    iv = base64.b64decode(iv_b64)
    ct = base64.b64decode(ct_b64)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(ct), AES.block_size).decode()
