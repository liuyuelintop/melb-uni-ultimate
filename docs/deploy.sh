#!/bin/bash

echo "🚀 Melbourne University Ultimate Frisbee Club MVP Deployment"
echo "=========================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo "Please create .env.local with the following variables:"
    echo "MONGODB_URI=your_mongodb_atlas_connection_string"
    echo "NEXTAUTH_SECRET=your_secret_key"
    echo "NEXTAUTH_URL=https://your-app-name.vercel.app"
    echo ""
    echo "See env.template for reference."
    exit 1
fi

echo "✅ Environment file found"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Seed the production database:"
echo "   curl -X POST https://your-app-name.vercel.app/api/seed"
echo "3. Test admin login: admin@muultimate.com / admin123"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 