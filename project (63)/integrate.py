import requests
import json
import os

MODE = os.getenv("MODE", "local")

if MODE == "lan":
    DETECTOR = "http://172.16.252.113:8000"  # Bhavesh
    VAULT    = "http://172.16.236.245:8001"  # Pranav
    ANOMALY  = "http://172.16.252.6:8002"  # Atharva
else:
    DETECTOR = "http://localhost:8000"
    VAULT    = "http://localhost:8001"
    ANOMALY  = "http://localhost:8002"
