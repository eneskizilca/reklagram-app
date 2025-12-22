# SLIM DEĞİL, FULL SÜRÜM (Derleme hatalarını çözer)
FROM python:3.10

# Logların anlık akması için
ENV PYTHONUNBUFFERED=1

# Çalışma dizini
WORKDIR /app

# 🛠️ KRİTİK BÖLÜM: Rust ve C Derleyicilerini Yüklüyoruz
# bcrypt ve cryptography kütüphaneleri bunlara ihtiyaç duyar.
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libffi-dev \
    cargo \
    rustc \
    && rm -rf /var/lib/apt/lists/*

# pip'i en son sürüme güncelle
RUN pip install --upgrade pip

# Listeyi kopyala
COPY requirements.txt .

# Yükle (-v ile detaylı log açtık)
RUN pip install --no-cache-dir -v -r requirements.txt

# Kodları kopyala
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]