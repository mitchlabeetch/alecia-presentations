#!/bin/bash
set -e

echo "🚀 Déploiement Alecia sur Vercel..."

# Build frontend
echo "📦 Construction du frontend..."
cd frontend
npm ci
npm run build

# Build server
echo "🔧 Construction du backend..."
cd ../server
npm ci
npx tsc

# Deploy to Vercel (requires Vercel CLI)
if command -v vercel &> /dev/null; then
    echo "🌐 Déploiement sur Vercel..."
    cd ..
    vercel --prod
else
    echo "⚠️ Vercel CLI non installé. Installez-le avec: npm i -g vercel"
    echo "Ou déployez manuellement:"
    echo "  1. vercel login"
    echo "  2. cd frontend && vercel --prod"
fi

echo "✅ Déploiement terminé!"
