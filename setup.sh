#!/bin/bash

echo "🚀 Setting up BookBazaar Project..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js version: $(node --version)"
echo -e "${GREEN}✓${NC} npm version: $(npm --version)"
echo ""

# Setup Backend
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your MongoDB connection string!"
fi

echo "Installing backend dependencies..."
npm install
echo -e "${GREEN}✓${NC} Backend setup complete!"
echo ""

# Setup Frontend
echo -e "${BLUE}📦 Setting up Frontend...${NC}"
cd ../frontend
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
fi

echo "Installing frontend dependencies..."
npm install
echo -e "${GREEN}✓${NC} Frontend setup complete!"
echo ""

# Summary
cd ..
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ BookBazaar setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Ensure MongoDB is running (locally or use MongoDB Atlas)"
echo "2. Update backend/.env with your MongoDB connection string"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm start"
echo ""
echo -e "${BLUE}Happy coding! 🎉${NC}"
