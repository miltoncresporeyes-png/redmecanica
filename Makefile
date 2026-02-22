
# Variables
BACKEND_DIR = backend
FRONTEND_DIR = frontend

.PHONY: dev db-migrate db-seed install clean

# Command to run development environment
dev:
	npx concurrently "cd $(BACKEND_DIR) && npm run dev" "cd $(FRONTEND_DIR) && npm run dev"

# Database migrations
db-migrate:
	cd $(BACKEND_DIR) && npx prisma migrate dev

# Seed the database
db-seed:
	cd $(BACKEND_DIR) && npx prisma db seed

# Install all dependencies
install:
	npm install
	cd $(BACKEND_DIR) && npm install
	cd $(FRONTEND_DIR) && npm install

# Docker commands
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f
