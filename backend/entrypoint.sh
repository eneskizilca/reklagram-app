#!/bin/sh

set -e

# Python script'ini çalıştırarak veritabanını bekle
python wait_for_db.py

# Veritabanı hazır olduğunda, ana uygulamayı başlat
exec uvicorn app.main:app --host 0.0.0.0 --port 8000