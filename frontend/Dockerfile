FROM node:20-alpine

WORKDIR /app

# Copy shared and build
COPY shared ./shared
RUN cd shared && npm install && npm run build

# Setup frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./

RUN npm install --legacy-peer-deps

# Copy rest
COPY frontend ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
