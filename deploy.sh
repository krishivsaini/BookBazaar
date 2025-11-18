#!/bin/bash

echo "🚀 BookBazaar Deployment Helper"
echo "================================"
echo ""
echo "This script will help you deploy your BookBazaar application."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Initializing..."
    git init
    git add .
    git commit -m "Initial commit for BookBazaar"
fi

echo "📦 Preparing deployment files..."
echo ""

# Add all changes
git add .

# Show status
echo "📋 Git Status:"
git status --short
echo ""

# Commit
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Deploy: Ready for production"
fi

git commit -m "$commit_msg"

echo ""
echo "✅ Code is ready for deployment!"
echo ""
echo "📌 Next Steps:"
echo ""
echo "1️⃣  PUSH TO GITHUB:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/BookBazaar.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "2️⃣  DEPLOY BACKEND to Render:"
echo "   • Go to https://render.com"
echo "   • Create new Web Service"
echo "   • Connect your GitHub repo"
echo "   • Root directory: backend"
echo "   • Build command: npm install"
echo "   • Start command: node server.js"
echo "   • Add environment variables:"
echo "       MONGODB_URI=your_mongodb_atlas_connection_string"
echo "       JWT_SECRET=your_secure_secret_key"
echo "       NODE_ENV=production"
echo ""
echo "3️⃣  DEPLOY FRONTEND to Vercel:"
echo "   • Go to https://vercel.com"
echo "   • Import your GitHub repo"
echo "   • Root directory: frontend"
echo "   • Framework: Create React App"
echo "   • Add environment variable:"
echo "       REACT_APP_API_URL=https://your-backend.onrender.com/api"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions!"
echo ""
