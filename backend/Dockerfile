FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

ENV PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1

# Copiar manifiestos primero para aprovechar el cache de capas de Docker
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Instalar dependencias (aislado del monorepo raíz)
RUN npm install --legacy-peer-deps --include=dev

# Copiar el resto del código fuente
COPY . .

# Generar Prisma Client y compilar TypeScript
RUN npx prisma generate && npm run build

ENV NODE_ENV=production

# Cap Node heap so it doesn't consume all RAM on shared hosting
ENV NODE_OPTIONS=--max-old-space-size=512

EXPOSE 3011

CMD ["npm", "start"]
