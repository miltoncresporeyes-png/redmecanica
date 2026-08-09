FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

ENV PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1

COPY . .

RUN npm install --legacy-peer-deps --include=dev && npx prisma generate

ENV NODE_ENV=production

# Cap Node heap so it doesn't consume all RAM on shared hosting
ENV NODE_OPTIONS=--max-old-space-size=512

EXPOSE 3011

CMD ["npm", "start"]
