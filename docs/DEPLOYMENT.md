# Guide de Deploiement

## Docker

### Demarrage rapide

```bash
# Cloner et configurer
git clone <repository-url>
cd Build_New_Version_Here
cp .env.example .env

# Editer .env avec vos valeurs
nano .env

# Demarrer avec Docker Compose
docker-compose up -d
```

### Verification

```bash
# Verifier le statut des conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f

# Verifier la sante
curl http://localhost:3001/health
```

### Arret

```bash
docker-compose down

# Avec suppression des volumes
docker-compose down -v
```

## Variables d'environnement

| Variable | Description | Requis | Defaut |
|----------|-------------|--------|--------|
| `APP_PIN_CODE` | Code PIN de la galerie | Oui | - |
| `APP_MASTER_PASSWORD` | Mot de passe maitre IA | Oui | - |
| `PORT` | Port du serveur | Non | `3001` |
| `DATABASE_PATH` | Chemin SQLite | Non | `./data/alecia.db` |
| `DOCLING_SIDECAR_URL` | URL Docling | Non | `http://localhost:8000` |
| `JWT_SECRET` | Secret JWT | Non | Auto-genere |

## Deploiement Manuel

### Backend

```bash
cd server

# Installer les dependances
npm install

# Configurer
cp ../.env.example .env
nano .env

# Build TypeScript
npm run build

# Initialiser la base de donnees
npm run db:init

# Demarrer
npm start
```

### Frontend

```bash
cd frontend

# Installer les dependances
npm install

# Build production
npm run build

# Les fichiers sont dans dist/
```

### Python Sidecar (Docling)

```bash
cd python-sidecar

# Creer un environnement virtuel
python -m venv venv
source venv/bin/activate

# Installer les dependances
pip install -r requirements.txt

# Demarrer
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name alecia.example.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

## HTTPS avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Generer le certificat
sudo certbot --nginx -d alecia.example.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

## Base de donnees

### Emplacement

Par defaut: `./data/alecia.db`

### Sauvegarde

```bash
# Sauvegarde
cp data/alecia.db backups/alecia-$(date +%Y%m%d).db

# Restauration
cp backups/alecia-20240101.db data/alecia.db
```

### Migration

```bash
# Appliquer les migrations
npm run db:migrate

# Reinitialiser (PERD LES DONNEES)
npm run db:reset
```

## Monitoring

### Sante de l'API

```bash
curl http://localhost:3001/health
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

### Logs

```bash
# Docker
docker-compose logs -f server

# Manuel
tail -f server/logs/app.log
```

## Rollback

### Docker

```bash
# Revenir a la version precedente
git checkout v1.0.0
docker-compose down
docker-compose up -d
```

### Manuel

```bash
# Revenir au commit precedent
git checkout v1.0.0
cd server && npm run build
pm2 restart alecia-server
```

## Securite

### Checklist

- [ ] PIN de la galerie configure
- [ ] Mot de passe maitre IA fort
- [ ] HTTPS active
- [ ] Base de donnees backup regulier
- [ ] Variables sensibles dans .env (pas dans git)
- [ ] CORS configure pour le domaine de production
