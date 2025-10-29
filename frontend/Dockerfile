# frontend/Dockerfile

FROM node:20-alpine AS builder 

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile --silent || npm install --silent

COPY . .

RUN yarn build

FROM node:20-alpine AS runner 

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["yarn", "start"]