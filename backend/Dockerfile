FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

ENV PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1

COPY . .

RUN npm install --legacy-peer-deps --include=dev && npx prisma generate && (npx tsc -p tsconfig.json --skipLibCheck || true)

ENV NODE_ENV=production

EXPOSE 3010

CMD ["npm", "run", "start"]
