import re

PATTERNS = {
    "EMAIL":   r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
    "PHONE":   r'\b[6-9]\d{9}\b',
    "AADHAAR": r'\b\d{4}\s?\d{4}\s?\d{4}\b',
    "PAN":     r'\b[A-Z]{5}[0-9]{4}[A-Z]\b',
    "CC":      r'\b(?:\d{4}[\s-]?){3}\d{4}\b',
}

def regex_entities(text: str) -> list:
    entities = []
    for label, pattern in PATTERNS.items():
        for m in re.finditer(pattern, text):
            entities.append({
                "entity": label,
                "word":   m.group(),
                "score":  1.0,
                "start":  m.start(),
                "end":    m.end()
            })
    return entities

def partial_mask_name(name: str) -> str:
    parts = name.strip().split()
    return ' '.join(p[0] + '*' * (len(p) - 1) if len(p) > 1 else p for p in parts)

def _smart_redact(entity: str, word: str) -> str:
    if entity == "EMAIL":
        parts = word.split("@")
        return f"****@{parts[1]}" if len(parts) == 2 else "****"
    elif entity == "PHONE":
        return "******" + word[-2:]
    elif entity == "AADHAAR":
        clean = word.replace(" ", "")
        return f"XXXX XXXX {clean[-4:]}"
    elif entity == "PAN":
        return word[:2] + "***" + word[-2:]
    elif entity == "PER":
        return partial_mask_name(word)
    elif entity == "CC":
        return "**** **** **** " + word.replace(" ", "").replace("-", "")[-4:]
    else:
        return "****"

def mask(text: str, entities: list, mode: str = "smart") -> str:
    """
    mode = 'smart'   → context aware masking (XXXX XXXX 9012, ****@gmail.com)
    mode = 'generic' → full tag replacement ([AADHAAR], [EMAIL])
    """
    masked = text
    for e in sorted(entities, key=lambda x: x["start"], reverse=True):
        if mode == "generic":
            tag = f"[{e['entity']}]"
        else:
            tag = _smart_redact(e["entity"], e["word"])
        masked = masked[:e["start"]] + tag + masked[e["end"]:]
    return masked
