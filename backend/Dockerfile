FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

ENV PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps --include=dev

COPY . .

RUN npx prisma generate && npx tsc -p tsconfig.json --skipLibCheck

ENV NODE_ENV=production

EXPOSE 3010

CMD ["npm", "run", "start"]
