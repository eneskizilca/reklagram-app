# backend/wait_for_db.py
import socket
import time
import os

host = os.environ.get("POSTGRES_HOST", "db_postgres")
port = int(os.environ.get("POSTGRES_PORT", 5432))

print(f"Veritabanı bekleniyor: {host}:{port}")

while True:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((host, port))
        print("Veritabanı hazır!")
        break
    except socket.error:
        print("PostgreSQL henüz hazır değil, 1 saniye bekleniyor...")
        time.sleep(1)