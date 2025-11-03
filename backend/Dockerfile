# reklagram/backend/Dockerfile

# Python 3.10 kullanıyoruz
FROM python:3.10-slim-buster

# Çalışma dizini
WORKDIR /app

# Sistem bağımlılıklarını kur (eğer gerekli ise - bcrypt için genellikle gerekmez ama dursun)
# Bu kısmı daha önce eklemiş olabilirsin, eklemediysen eklenebilir.
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libffi-dev \
#     libssl-dev \
#     python3-dev \
#     && rm -rf /var/lib/apt/lists/*

# Gereksinimler dosyasını kopyala
COPY ./requirements.txt /app/requirements.txt

# Gerekli Python kütüphanelerini kur
# pip önbelleğini temizleyerek ve cryptography'yi direkt belirterek daha sağlam bir kurulum yapalım
RUN pip install --no-cache-dir -r /app/requirements.txt && \
    pip install --no-cache-dir cryptography # <<< Bu satırı da ayrı ekleyebiliriz emin olmak için

# Proje dosyalarını kopyala
COPY ./app /app/app

# Portu açığa çıkar
EXPOSE 8000

# Uygulamayı başlat
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]