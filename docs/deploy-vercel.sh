#!/bin/bash

echo "🚀 Melbourne University Ultimate Frisbee Club - Vercel Deployment"
echo "================================================================"

# Check if user is logged in to Vercel
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

echo "✅ Vercel CLI is ready"

# Build the project first
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Copy your Vercel URL from above"
    echo "2. Go to Vercel Dashboard → Settings → Environment Variables"
    echo "3. Add the environment variables from env.production"
    echo "4. Update NEXTAUTH_URL with your actual Vercel URL"
    echo "5. Create the first admin user directly against the database"
    echo "   (the unauthenticated /api/seed endpoint has been removed)"
    echo ""
    echo "📖 See VERCEL_DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi 