FROM node:20-alpine

WORKDIR /app/frontend

COPY frontend/package*.json ./
COPY shared ../shared
COPY frontend/vite.config.ts ./
COPY frontend/index.html ./
COPY frontend/tsconfig.json ./
COPY frontend/postcss.config.js ./
COPY frontend/tailwind.config.js ./
COPY frontend/public ./public

RUN npm install --legacy-peer-deps

COPY frontend/src ./src

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
