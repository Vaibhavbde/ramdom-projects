from transformers import pipeline

_pipe = None

def load_model():
    global _pipe
    _pipe = pipeline(
        "token-classification",
        model="dslim/bert-base-NER",
        aggregation_strategy="first"
    )

def detect(text: str) -> list:
    if _pipe is None:
        load_model()
    results = _pipe(text)
    
    merged = []
    for r in results:
        if merged and r["start"] == merged[-1]["end"] and r["entity_group"] == merged[-1]["entity"]:
            merged[-1]["end"] = r["end"]
            merged[-1]["word"] += r["word"].replace("##", "")
        else:
            merged.append({
                "entity": r["entity_group"],
                "word":   r["word"],
                "score":  round(float(r["score"]), 3),
                "start":  r["start"],
                "end":    r["end"]
            })
    return merged
