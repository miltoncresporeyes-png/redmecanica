#!/bin/bash

# RedMecánica - Deploy Script
# Usage: ./deploy.sh [environment] [component]
# Example: ./deploy.sh production all

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Config
ENVIRONMENT=${1:-production}
COMPONENT=${2:-all}

echo -e "${BLUE}🚀 RedMecánica Deploy Script${NC}"
echo "Environment: $ENVIRONMENT"
echo "Component: $COMPONENT"
echo ""

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Error: npm is not installed${NC}"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}Error: git is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Prerequisites OK${NC}"
}

# Install dependencies
install_deps() {
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    cd frontend && npm install && cd ..
    cd backend && npm install && cd ..
    echo -e "${GREEN}✓ Dependencies installed${NC}"
}

# Build frontend
build_frontend() {
    echo -e "${YELLOW}Building frontend...${NC}"
    cd frontend
    npm run build
    echo -e "${GREEN}✓ Frontend built${NC}"
    cd ..
}

# Build backend
build_backend() {
    echo -e "${YELLOW}Building backend...${NC}"
    cd backend
    npx prisma generate
    echo -e "${GREEN}✓ Backend built${NC}"
    cd ..
}

# Deploy frontend to Vercel
deploy_frontend() {
    echo -e "${YELLOW}Deploying frontend to Vercel...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    cd frontend
    vercel --prod --yes
    cd ..
    
    echo -e "${GREEN}✓ Frontend deployed to Vercel${NC}"
}

# Deploy backend to Render
deploy_backend() {
    echo -e "${YELLOW}Deploying backend to Render...${NC}"
    
    echo "Note: Manual deployment to Render required"
    echo "1. Push to GitHub"
    echo "2. Connect repository in Render dashboard"
    echo "3. Configure environment variables"
    echo "4. Deploy from Render UI"
    
    echo -e "${GREEN}✓ Backend deployment initiated${NC}"
}

# Deploy database
deploy_database() {
    echo -e "${YELLOW}Setting up database...${NC}"
    
    echo "Database setup requires:"
    echo "1. Create PostgreSQL in Render"
    echo "2. Set DATABASE_URL"
    echo "3. Run: cd backend && npx prisma migrate deploy"
    echo "4. Run: cd backend && npx tsx prisma/seed.ts"
    
    echo -e "${GREEN}✓ Database setup instructions provided${NC}"
}

# Full deploy
deploy_all() {
    check_prerequisites
    install_deps
    build_frontend
    build_backend
    
    if [ "$ENVIRONMENT" = "production" ]; then
        deploy_frontend
        deploy_backend
        deploy_database
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Deploy complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure environment variables in Render"
    echo "2. Run database migrations"
    echo "3. Test the application"
}

# Show help
show_help() {
    echo "Usage: ./deploy.sh [environment] [component]"
    echo ""
    echo "Arguments:"
    echo "  environment   production (default) or staging"
    echo "  component     all, frontend, backend, or database"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh              # Full production deploy"
    echo "  ./deploy.sh staging all  # Deploy to staging"
    echo "  ./deploy.sh prod frontend # Deploy only frontend"
}

# Main
case $COMPONENT in
    all)
        deploy_all
        ;;
    frontend)
        check_prerequisites
        install_deps
        build_frontend
        deploy_frontend
        ;;
    backend)
        check_prerequisites
        install_deps
        build_backend
        deploy_backend
        ;;
    database)
        deploy_database
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown component: $COMPONENT"
        show_help
        exit 1
        ;;
esac
