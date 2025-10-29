# backend/Dockerfile

FROM python:3.10-slim-bookworm

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY . /app

# YENİ EKLENEN SATIR: entrypoint.sh'i çalıştırılabilir yap
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

# DEĞİŞEN SATIR: CMD yerine ENTRYPOINT kullanıyoruz
ENTRYPOINT ["/app/entrypoint.sh"]