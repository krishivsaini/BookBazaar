#!/bin/bash

# BookBazaar - Start Development Servers
# This script starts both backend and frontend servers

echo "🚀 Starting BookBazaar Development Environment"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the BookBazaar root directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Backend dependencies not found. Installing..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies not found. Installing..."
    cd frontend && npm install && cd ..
fi

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env not found. Creating from example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your MongoDB connection!"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env not found. Creating from example..."
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "✅ All dependencies are ready!"
echo ""
echo "📝 Starting servers..."
echo "   - Backend will run on http://localhost:5000"
echo "   - Frontend will run on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend in background
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

# Wait for both processes
wait
