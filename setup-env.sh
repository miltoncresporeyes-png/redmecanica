#!/bin/bash

# RedMecánica - Environment Setup Script
# Usage: ./setup-env.sh

echo "🔧 RedMecánica - Environment Setup"
echo ""

# Check if .env files exist
if [ -f "backend/.env" ]; then
    echo "⚠️  backend/.env already exists"
    read -p "Overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipped backend/.env"
    else
        cat > backend/.env << 'EOF'
# Server
PORT=3010
NODE_ENV=development

# Database (PostgreSQL) - UPDATE FOR PRODUCTION
DATABASE_URL="postgresql://postgres:password@localhost:5432/redmecanica"

# JWT Secrets - CHANGE FOR PRODUCTION
ACCESS_TOKEN_SECRET="dev_access_secret_change_in_production"
REFRESH_TOKEN_SECRET="dev_refresh_secret_change_in_production"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Webpay (Optional - uses simulation mode if empty)
# WEBPAY_COMMERCE_CODE=""
# WEBPAY_API_KEY=""
# WEBPAY_RETURN_URL="https://your-domain.com/payment/return"
# WEBPAY_FINAL_URL="https://your-domain.com/payment/final"

# Gemini AI (Optional)
GEMINI_API_KEY=""
EOF
        echo "✓ backend/.env created"
    fi
else
    cat > backend/.env << 'EOF'
# Server
PORT=3010
NODE_ENV=development

# Database (PostgreSQL) - UPDATE FOR PRODUCTION
DATABASE_URL="postgresql://postgres:password@localhost:5432/redmecanica"

# JWT Secrets - CHANGE FOR PRODUCTION
ACCESS_TOKEN_SECRET="dev_access_secret_change_in_production"
REFRESH_TOKEN_SECRET="dev_refresh_secret_change_in_production"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Webpay (Optional - uses simulation mode if empty)
# WEBPAY_COMMERCE_CODE=""
# WEBPAY_API_KEY=""
# WEBPAY_RETURN_URL="https://your-domain.com/payment/return"
# WEBPAY_FINAL_URL="https://your-domain.com/payment/final"

# Gemini AI (Optional)
GEMINI_API_KEY=""
EOF
    echo "✓ backend/.env created"
fi

# Frontend .env
if [ -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local already exists"
    read -p "Overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipped frontend/.env.local"
    else
        cat > frontend/.env.local << 'EOF'
VITE_API_URL=http://localhost:3010/api
GEMINI_API_KEY=
EOF
        echo "✓ frontend/.env.local created"
    fi
else
    cat > frontend/.env.local << 'EOF'
VITE_API_URL=http://localhost:3010/api
GEMINI_API_KEY=
EOF
    echo "✓ frontend/.env.local created"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update DATABASE_URL with your PostgreSQL connection"
echo "2. Generate secure JWT secrets"
echo "3. (Optional) Configure Webpay credentials"
echo "4. Run: npm run dev"
