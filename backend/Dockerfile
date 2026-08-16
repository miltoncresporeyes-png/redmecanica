FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

ENV PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1

# Copiar manifiestos primero para aprovechar el cache de capas de Docker
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Instalar dependencias SIN ejecutar postinstall (evita que prisma generate
# falle antes de que el código fuente esté disponible)
RUN npm install --legacy-peer-deps --include=dev --ignore-scripts

# Copiar el resto del código fuente
COPY . .

# Generar Prisma Client (con binaryTargets correctos para Alpine) y compilar
RUN npx prisma generate && npm run build --ignore-scripts

ENV NODE_ENV=production

# Cap Node heap so it doesn't consume all RAM on shared hosting
ENV NODE_OPTIONS=--max-old-space-size=512

EXPOSE 3011

CMD ["npm", "start"]
