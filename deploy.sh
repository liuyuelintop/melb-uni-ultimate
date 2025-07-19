#!/bin/bash

echo "🚀 Deploying Melbourne University Ultimate Frisbee Club..."

# Force fresh deployment
echo "📦 Building and deploying..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your site: https://melb-uni-ultimate.vercel.app/"
echo ""
echo "💡 If you updated environment variables, this deployment should pick them up." 