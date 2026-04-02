# API Reference

## Base URL

```
http://localhost:3001/api
```

## Authentification

### POST /api/auth/verify

Verifie le code PIN de la galerie.

```bash
curl -X POST /api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"pin": "1234"}'
```

**Reponse:**
```json
{
  "hasAccess": true,
  "hasMasterAccess": false
}
```

| Code | Description |
|------|-------------|
| 200 | PIN valide |
| 400 | PIN manquant |
| 401 | PIN invalide |

### POST /api/auth/verify-project

Verifie le code PIN d'un projet specifique.

```bash
curl -X POST /api/auth/verify-project \
  -H "Content-Type: application/json" \
  -d '{"projectId": "uuid", "pin": "5678"}'
```

**Reponse:**
```json
{
  "hasAccess": true
}
```

## Projets

### GET /api/projects

Liste tous les projets.

```bash
curl /api/projects
```

**Reponse:**
```json
[
  {
    "id": "uuid",
    "name": "Projet Test",
    "description": "Description",
    "pin_code": null,
    "is_template": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/projects

Cree un nouveau projet.

```bash
curl -X POST /api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouveau Projet",
    "description": "Description optionnelle",
    "pin_code": "1234"
  }'
```

**Reponse:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Nouveau Projet",
  ...
}
```

### GET /api/projects/:id

Recupere un projet par son ID.

```bash
curl /api/projects/uuid
```

### PUT /api/projects/:id

Met a jour un projet.

```bash
curl -X PUT /api/projects/uuid \
  -H "Content-Type: application/json" \
  -d '{"name": "Nom mis a jour"}'
```

### DELETE /api/projects/:id

Supprime un projet.

```bash
curl -X DELETE /api/projects/uuid
```

**Reponse:**
```json
{
  "success": true
}
```

## Diapositives

### GET /api/slides

Liste les diapositives d'un projet.

```bash
curl "/api/slides?projectId=uuid"
```

### POST /api/slides

Cree une nouvelle diapositive.

```bash
curl -X POST /api/slides \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "uuid",
    "position": 0,
    "title": "Diapositive 1",
    "layout": "blank",
    "background_color": "#ffffff"
  }'
```

### GET /api/slides/:id

Recupere une diapositive.

### PATCH /api/slides/:id

Met a jour une diapositive.

```bash
curl -X PATCH /api/slides/uuid \
  -H "Content-Type: application/json" \
  -d '{"title": "Nouveau titre", "layout": "two-column"}'
```

### DELETE /api/slides/:id

Supprime une diapositive.

### POST /api/slides/reorder

Reordonne les diapositives.

```bash
curl -X POST /api/slides/reorder \
  -H "Content-Type: application/json" \
  -d '{"projectId": "uuid", "slideIds": ["id1", "id2", "id3"]}'
```

### GET /api/slides/:id/blocks

Liste les blocs d'une diapositive.

### POST /api/slides/:id/blocks

Ajoute un bloc a une diapositive.

```bash
curl -X POST /api/slides/uuid/blocks \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "position": 0,
    "content": "{\"text\": \"Contenu\"}",
    "style": "{}"
  }'
```

## Blocs

### PATCH /api/blocks/:id

Met a jour un bloc.

```bash
curl -X PATCH /api/blocks/uuid \
  -H "Content-Type: application/json" \
  -d '{"content": "{\"text\": \"Nouveau\"}", "position": 1}'
```

### DELETE /api/blocks/:id

Supprime un bloc.

## Modeles

### GET /api/templates

Liste tous les modeles.

```bash
curl /api/templates
```

Filtrer par categorie:
```bash
curl "/api/templates?category=ma"
```

Categories disponibles: `ma`, `general`, `custom`

### GET /api/templates/:id

Recupere un modele.

### POST /api/templates

Cree un modele personnalise.

```bash
curl -X POST /api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon Modele",
    "description": "Description",
    "category": "custom",
    "slides_data": "[]"
  }'
```

### DELETE /api/templates/:id

Supprime un modele personnalise.

## Chat IA

### GET /api/chat/conversations

Liste les conversations d'un projet.

```bash
curl "/api/chat/conversations?projectId=uuid"
```

### POST /api/chat/conversations

Cree une nouvelle conversation.

```bash
curl -X POST /api/chat/conversations \
  -H "Content-Type: application/json" \
  -d '{"projectId": "uuid"}'
```

### GET /api/chat/conversations/:id/messages

Liste les messages d'une conversation.

### POST /api/chat/conversations/:id/messages

Envoie un message (streaming).

```bash
curl -X POST /api/chat/conversations/uuid/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "Question pour l'IA"}'
```

**Streaming Response:**
```
data: {"type": "message", "content": "Partial..."}
data: {"type": "message", "content": " response..."}
data: {"type": "done"}
```

## Export

### POST /api/export/pptx

Initie une exportation.

```bash
curl -X POST /api/export/pptx \
  -H "Content-Type: application/json" \
  -d '{"projectId": "uuid", "format": "pptx"}'
```

Formats supportes: `pptx`, `pdf`, `png`

**Reponse:**
```json
{
  "exportId": "uuid",
  "status": "processing"
}
```

### GET /api/export/status/:id

Verifie le statut de l'exportation.

```bash
curl /api/export/status/uuid
```

### GET /api/export/download/:id

Telecharge le fichier exporte.

```bash
curl -O /api/export/download/uuid
```

## Commentaires

### GET /api/comments

Liste les commentaires d'un projet.

```bash
curl "/api/comments?projectId=uuid"
```

Filtrer par diapositive:
```bash
curl "/api/comments?projectId=uuid&slideId=slide-uuid"
```

### POST /api/comments

Cree un commentaire.

```bash
curl -X POST /api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "uuid",
    "slide_id": "uuid",
    "user_id": "user-id",
    "user_name": "Nom",
    "content": "Commentaire",
    "position_x": 100,
    "position_y": 200
  }'
```

### PATCH /api/comments/:id/resolve

Marque un commentaire comme resolu.

```bash
curl -X PATCH /api/comments/uuid/resolve
```

### DELETE /api/comments/:id

Supprime un commentaire.

## Variables

### GET /api/variables

Liste les variables d'un projet.

```bash
curl "/api/variables?projectId=uuid"
```

### POST /api/variables

Cree une variable.

```bash
curl -X POST /api/variables \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "uuid",
    "name": "nom_entreprise",
    "value": "Acme Corp",
    "type": "text"
  }'
```

Types: `text`, `number`, `date`, `currency`

### PUT /api/variables/:id

Met a jour une variable.

### DELETE /api/variables/:id

Supprime une variable.

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Requete invalide |
| 401 | Non autorise |
| 404 | Ressource non trouvee |
| 500 | Erreur serveur |
