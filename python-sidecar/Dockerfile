# =============================================================================
# Alecia Presentation Builder - Python Docling Sidecar Dockerfile
# =============================================================================

# Image de base Python 3.11
FROM python:3.11-slim

# Labels pour Alecia
LABEL maintainer="Alecia <contact@alecia.fr>"
LABEL description="Service de conversion de documents PPTX/PDF pour Alecia Presentation Builder"

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Répertoire de travail
WORKDIR /app

# =============================================================================
# Installation des dépendances système
# =============================================================================

RUN apt-get update && apt-get install -y --no-install-recommends \
    # Dépendances pour PyMuPDF
    libmupdf-dev \
    mupdf-tools \
    # Dépendances pour le traitement d'images
    libjpeg-dev \
    zlib1g-dev \
    libpng-dev \
    # Outils divers
    curl \
    git \
    # Nettoyage
    && rm -rf /var/lib/apt/lists/*

# =============================================================================
# Installation des dépendances Python
# =============================================================================

COPY requirements.txt .

# Installation des dépendances avec cache
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# =============================================================================
# Copie du code de l'application
# =============================================================================

COPY app/ ./app/

# Création des répertoires nécessaires
RUN mkdir -p /app/uploads /app/temp

# =============================================================================
# Configuration du réseau
# =============================================================================

# Exposer le port
EXPOSE 8000

# =============================================================================
# Healthcheck
# =============================================================================

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# =============================================================================
# Démarrage
# =============================================================================

# Commande de démarrage
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Alternatively, for production with multiple workers:
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
