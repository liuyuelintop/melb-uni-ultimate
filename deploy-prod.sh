#!/bin/bash

# Melbourne University Ultimate Frisbee Club - Production Deployment Script
# ========================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Header
echo "🚀 Melbourne University Ultimate Frisbee Club - Production Deployment"
echo "====================================================================="
echo ""

# Check if Vercel CLI is installed
print_status "Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Installing..."
    npm install -g vercel
    print_success "Vercel CLI installed"
else
    print_success "Vercel CLI found: $(vercel --version)"
fi

# Check if user is logged in to Vercel
print_status "Checking Vercel authentication..."
if ! vercel whoami > /dev/null 2>&1; then
    print_error "Not logged in to Vercel. Please run: vercel login"
    exit 1
else
    print_success "Logged in as: $(vercel whoami)"
fi

# Check if env.prod exists
print_status "Checking environment file..."
if [ ! -f env.prod ]; then
    print_error "env.prod file not found!"
    echo "Please create env.prod with the required environment variables."
    echo "See env.production.template for reference."
    exit 1
fi
print_success "Environment file found"

# Build the project first
print_status "Building project..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
if vercel --prod; then
    print_success "Deployment successful!"
else
    print_error "Deployment failed. Please check the error messages above."
    exit 1
fi

# Get the deployment URL
print_status "Getting deployment URL..."
DEPLOYMENT_URL=$(vercel ls | grep "melb-uni-ultimate" | head -1 | awk '{print $2}')
if [ -z "$DEPLOYMENT_URL" ]; then
    print_warning "Could not automatically get deployment URL"
    DEPLOYMENT_URL="https://your-app-name.vercel.app"
else
    print_success "Deployment URL: $DEPLOYMENT_URL"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""

# Post-deployment instructions
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🌐 Your app is live at: $DEPLOYMENT_URL"
echo ""
echo "2. ⚙️  Set up environment variables in Vercel Dashboard:"
echo "   - Go to: https://vercel.com/dashboard"
echo "   - Select your project: melb-uni-ultimate"
echo "   - Go to Settings → Environment Variables"
echo "   - Add the following variables from env.prod:"
echo "     • MONGODB_URI"
echo "     • NEXTAUTH_SECRET"
echo "     • NEXTAUTH_URL (update with: $DEPLOYMENT_URL)"
echo "     • NEXT_PUBLIC_APP_NAME"
echo "     • NEXT_PUBLIC_APP_URL (update with: $DEPLOYMENT_URL)"
echo ""
echo "3. 🔄 Redeploy after setting environment variables:"
echo "   vercel --prod"
echo ""
echo "4. 🌱 Seed the production database:"
echo "   curl -X POST $DEPLOYMENT_URL/api/seed"
echo ""
echo "5. 🔑 Test admin login:"
echo "   Email: admin@muultimate.com"
echo "   Password: admin123"
echo ""
echo "6. 🔒 SECURITY: Change your MongoDB password immediately!"
echo "   The current password was exposed in git history."
echo ""

# Optional: Auto-update environment variables
read -p "🤔 Would you like to automatically set environment variables? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Setting environment variables..."
    
    # Read values from env.prod
    source <(grep -E '^[A-Z_]+=' env.prod | sed 's/^/export /')
    
    # Update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL with actual deployment URL
    export NEXTAUTH_URL="$DEPLOYMENT_URL"
    export NEXT_PUBLIC_APP_URL="$DEPLOYMENT_URL"
    
    # Add environment variables to Vercel
    echo "$MONGODB_URI" | vercel env add MONGODB_URI production
    echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production
    echo "$NEXTAUTH_URL" | vercel env add NEXTAUTH_URL production
    echo "$NEXT_PUBLIC_APP_NAME" | vercel env add NEXT_PUBLIC_APP_NAME production
    echo "$NEXT_PUBLIC_APP_URL" | vercel env add NEXT_PUBLIC_APP_URL production
    
    print_success "Environment variables set successfully"
    
    # Redeploy
    print_status "Redeploying with environment variables..."
    vercel --prod
    print_success "Redeployment completed"
fi

echo ""
echo "🎯 Your Melbourne University Ultimate Frisbee Club website is now live!"
echo "📖 For detailed documentation, see: docs/DEPLOYMENT.md"
echo ""
echo "�� Go Ultimate! 🥏" 