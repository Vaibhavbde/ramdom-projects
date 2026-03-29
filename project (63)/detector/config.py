NETWORK_MODE = "local"  # switch to "lan" on hackathon day

SERVICES = {
    "local": {
        "vault":    "http://127.0.0.1:8001",
        "anomaly":  "http://127.0.0.1:8002",
    },
    "lan": {
        "vault":    "http://192.168.1.102:8001",  # Pranav's IP
        "anomaly":  "http://192.168.1.103:8002",  # 4060 guy's IP
    }
}
