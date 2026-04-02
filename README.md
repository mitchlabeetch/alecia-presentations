# Alecia Presentations

Créateur de pitch decks M&A pour alecia.

## Fonctionnalités

- Création de présentations par drag-and-drop
- 21 types de blocs spécialisés M&A
- Export PPTX, PDF, PNG
- Import PPTX via Docling
- IA intégrée (20+ providers)
- Variables de présentation
- Collaboration en temps réel
- 100% interface française

## Prérequis

- Node.js 18+
- npm
- Docker (pour le déploiement)

## Installation rapide

```bash
# Configuration automatique
./scripts/setup.sh

# Ou configuration manuelle
cp .env.example .env
npm install
```

## Configuration

Editez le fichier `.env`:

```env
APP_PIN_CODE=votre-code-pin
APP_MASTER_PASSWORD=votre-mot-de-passe
```

## Développement

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Déploiement

### Docker Compose (recommandé)

```bash
./scripts/deploy-coolify.sh
```

### Vercel

```bash
./scripts/deploy-vercel.sh
```

### Déploiement manuel

```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd ../server && npm run build
```

## Tests

```bash
npm run test          # Tests unitaires
npm run test:e2e     # Tests E2E
npm run test:coverage # Couverture
```

## Structure

```
Build_New_Version_Here/
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── components/  # Composants UI
│       ├── hooks/       # Hooks React
│       ├── lib/        # Clients API
│       ├── store/      # Zustand store
│       └── types/      # Types TypeScript
├── server/            # Express + SQLite
│   ├── db/          # Base de données
│   ├── middleware/  # Middleware
│   ├── routes/      # Routes API
│   └── services/    # Services métier
├── python-sidecar/   # FastAPI + Docling
├── tests/            # Tests
└── scripts/         # Scripts de déploiement
```

## API

Voir [docs/API.md](docs/API.md) pour la documentation complète.

## Licence

Propriétaire - alecia
