#!/bin/bash
set -e

echo "🚀 Déploiement Alecia avec Docker Compose..."

# Build et démarrage
echo "📦 Construction des images Docker..."
docker-compose build

echo "🚀 Démarrage des services..."
docker-compose up -d

echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérification
echo "🔍 Vérification des services..."

# Vérifier le backend
if curl -f http://localhost:3001/health 2>/dev/null; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: ERREUR"
fi

# Vérifier le frontend
if curl -f http://localhost:3000 2>/dev/null; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: ERREUR"
fi

# Vérifier Docling
if curl -f http://localhost:8000/health 2>/dev/null; then
    echo "✅ Docling: OK"
else
    echo "⚠️ Docling: Service optionnel"
fi

echo ""
echo "🌐 Services démarrés:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Docling:  http://localhost:8000"
echo ""
echo "📝 Commandes utiles:"
echo "   docker-compose logs -f       # Voir les logs"
echo "   docker-compose down         # Arrêter les services"
echo "   docker-compose restart      # Redémarrer"
echo ""
echo "✅ Déploiement terminé!"
