# Alecia Presentations v2.1

Application de création de présentations PowerPoint avec backend SQLite intégré.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm

### Installation

```bash
# Installer les dépendances
npm install

# Lancer l'application (client + serveur)
npm run dev
```

L'application sera disponible sur :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001

La base de données SQLite sera automatiquement initialisée et peuplée avec des données de test.

## 📁 Structure du Projet

```
alecia-presentations/
├── server/                    # Backend Node.js + SQLite
│   ├── db/
│   │   ├── schema.sql        # Schéma de la base de données
│   │   ├── database.js       # Connexion et utilitaires DB
│   │   ├── init.js           # Script d'initialisation
│   │   └── seed.js           # Données de test
│   ├── routes/               # API REST
│   │   ├── auth.js           # Authentification
│   │   ├── presentations.js  # CRUD présentations
│   │   ├── templates.js      # Templates
│   │   ├── assets.js         # Images/logos
│   │   ├── variables.js      # Variables de présentation
│   │   └── export.js         # Export PPTX/PDF
│   └── index.js              # Point d'entrée serveur
├── src/
│   ├── pages/
│   │   ├── AuthPage.tsx      # Page de connexion
│   │   ├── DashboardPage.tsx # Liste des présentations
│   │   └── EditorPage.tsx    # Éditeur principal
│   ├── store/
│   │   └── authStore.ts      # Store Zustand auth
│   ├── App.tsx               # Routeur principal
│   └── main.tsx              # Point d'entrée React
├── data/                      # Base de données SQLite (auto-créée)
└── uploads/                   # Fichiers uploadés
```

## ✨ Fonctionnalités

### 🔐 Authentification
- Page de connexion avec branding Alecia
- JWT tokens avec persistance
- 3 niveaux de permissions : Admin, Editor, Viewer
- Comptes de démo inclus

### 🎨 Éditeur Principal
- **Canvas** : Édition visuelle des slides
- **Panel Slides** : Réorganisation par drag & drop
- **Panel Blocs** : Ajout rapide de contenu
- **Panel Templates** : Templates pré-conçus
- **Panel Propriétés** : Édition des slides
- **Panel Variables** : Gestion des variables globales
- **Assistant IA** : Chat intégré pour l'aide
- **Collaboration** : Temps réel multi-utilisateurs

### 🎯 Drag & Drop
- Réordonnancement des slides
- Bibliothèque de blocs de contenu
- 10 types de slides disponibles

### 📑 Templates (8 templates)
- **Pitch Deck** - Présentation client standard
- **Levée de Fonds** - Accompagnement levée
- **Cession** - Opération de cession
- **Acquisition** - Projet acquisition
- **Financements Structurés** - Structuration dette
- **Équipe** - Présentation équipe
- **Références Clients** - Track record
- **Rapport** - Rapport générique

### 🔧 Variables Globales
- Syntaxe `{{variable}}`
- Remplacement dans toute la présentation
- Préréglages sauvegardables
- Variables personnalisables

### 👥 Collaboration (Temps Réel)
- WebSocket avec Socket.io
- Présence des utilisateurs
- Curseurs en direct
- Synchronisation des modifications
- Journal d'activité

### 📤 Export
- Export PPTX (PowerPoint natif)
- Charte graphique Alecia intégrée
- Filigrane ampersand

## 🗄️ Base de Données SQLite

### Tables

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs et authentification |
| `presentations` | Présentations |
| `slides` | Slides individuelles |
| `templates` | Templates réutilisables |
| `assets` | Images et logos |
| `variable_presets` | Préréglages de variables |
| `collaboration_sessions` | Sessions de collaboration |
| `activity_log` | Journal d'activité |

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Utilisateur courant

### Présentations
- `GET /api/presentations` - Liste
- `GET /api/presentations/:id` - Détail
- `POST /api/presentations` - Créer
- `PUT /api/presentations/:id` - Modifier
- `DELETE /api/presentations/:id` - Supprimer

### Slides
- `POST /api/presentations/:id/slides` - Ajouter
- `PUT /api/presentations/:id/slides/:slideId` - Modifier
- `DELETE /api/presentations/:id/slides/:slideId` - Supprimer
- `POST /api/presentations/:id/reorder` - Réordonner

### Templates
- `GET /api/templates` - Liste
- `GET /api/templates/:id` - Détail
- `POST /api/templates` - Créer
- `PUT /api/templates/:id` - Modifier
- `DELETE /api/templates/:id` - Supprimer

### Variables
- `GET /api/variables/presets` - Préréglages
- `POST /api/variables/presets` - Créer
- `PUT /api/variables/presets/:id` - Modifier
- `DELETE /api/variables/presets/:id` - Supprimer

### Export
- `POST /api/export/pptx/:presentationId` - Export PPTX

## 🎨 Identité Visuelle

- **Couleur principale** : Navy `#0a1628`
- **Accent** : Pink `#e91e63`
- **Filigrane** : Ampersand `&`
- **Typographie** : Inter
- **Interface** : 100% Français

## 👥 Comptes de Démo

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| jean.dupont@alecia.fr | password123 | Admin |
| marie.martin@alecia.fr | password123 | Editor |
| pierre.bernard@alecia.fr | password123 | Viewer |

## 🛠️ Technologies

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- Framer Motion (animations)
- @dnd-kit (drag & drop)
- Lucide React (icônes)
- Socket.io-client (WebSocket)

### Backend
- Node.js + Express
- better-sqlite3 (SQLite)
- bcryptjs (hashing)
- jsonwebtoken (JWT)
- Socket.io (WebSocket)
- Multer (upload fichiers)
- pptxgenjs (génération PPTX)

## 📝 Scripts

```bash
# Développement (client + serveur)
npm run dev

# Client seul
npm run client

# Serveur seul
npm run server

# Build production
npm run build

# Initialiser DB
npm run db:init

# Seed données de test
npm run db:seed
```

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- JWT pour l'authentification
- Validation des entrées
- Protection contre injection SQL (prepared statements)
- CORS configuré

## 🚧 Roadmap

### v2.2
- [ ] Éditeur riche de contenu (WYSIWYG)
- [ ] Plus de types de graphiques
- [ ] Historique des versions

### v2.3
- [ ] Mode présentation intégré
- [ ] Transitions entre slides
- [ ] Export PDF

### v2.4
- [ ] Intégration IA (OpenAI)
- [ ] Suggestions intelligentes
- [ ] Génération automatique de contenu

## 📄 Licence

MIT License - © 2026 Alecia
