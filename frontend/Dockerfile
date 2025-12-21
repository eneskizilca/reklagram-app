# 1. AŞAMA: Builder
FROM node:20-slim AS builder

WORKDIR /app

# Gerekli sistem araçlarını yükle (node-gyp vs için gerekebilir)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile --silent || npm install --silent

COPY . .
RUN yarn build || npm run build

# --------------------------------------------------------

# 2. AŞAMA: Runner (Chromium ile)
FROM node:20-slim AS runner

WORKDIR /app

# --- CHROMIUM KURULUMU (Chrome Yerine) ---
# Chromium, ARM64 (Mac M1/M2) ve AMD64 (Intel) destekler.
RUN apt-get update \
    && apt-get install -y chromium fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Puppeteer Ayarları:
# 1. Chromium'u tekrar indirme, kurduğumuzu kullan.
# 2. Executable yolunu Chromium'a çevir.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]