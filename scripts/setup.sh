#!/bin/bash
set -e

echo "🔧 Configuration d'Alecia..."

# Créer le fichier .env si nécessaire
if [ ! -f .env ]; then
    echo "📄 Création du fichier .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé"
    echo "⚠️ Veuillez modifier .env et définir vos mots de passe"
else
    echo "ℹ️ Le fichier .env existe déjà"
fi

# Créer les répertoires nécessaires
echo "📁 Création des répertoires..."
mkdir -p data
mkdir -p uploads
mkdir -p uploads/imports
mkdir -p exports

# Installer les dépendances frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
npm ci

# Installer les dépendances backend
echo "📦 Installation des dépendances backend..."
cd ../server
npm ci

# Retour à la racine
cd ..

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "📝 Étapes suivantes:"
echo "   1. Modifiez le fichier .env avec vos mots de passe"
echo "   2. Lancez le serveur: npm run dev"
echo "   3. Ou déployez avec Docker: ./scripts/deploy-coolify.sh"
