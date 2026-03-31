Alecia Presentations/DEPLOY.md
```

```markdown
# Alecia Presentations - Deployment Guide

## Overview
Alecia Presentations is an M&A presentation generator built with:
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Convex (self-hosted)
- **Styling**: Tailwind CSS
- **Deployment**: Coolify

## Prerequisites
- Git repository with project
- Coolify instance running
- Domain configured (aleciasite.manuora.fr)
- Convex backend deployed (aleciaconvex.manuora.fr)

## Environment Variables

### Frontend (.env)
```env
VITE_CONVEX_URL=https://aleciaconvex.manuora.fr
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
VITE_ANALYTICS_ENDPOINT=
```

### Backend (Convex)
No additional env vars needed - uses self-hosted Convex at aleciaconvex.manuora.fr

## Deployment Steps

### 1. Prepare Git Repository
```bash
git init
git add .
git commit -m "feat: Alecia Presentations MVP"
git remote add origin https://github.com/your-org/alecia-presentations.git
git push -u origin main
```

### 2. Deploy Frontend to Coolify
1. Log in to Coolify
2. Click "New Resource" → "Application"
3. Select Git repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Port: 3000 (or as configured)
   - Environment Variables: Add VITE_* vars
5. Click Deploy

### 3. Deploy Convex Backend
```bash
cd alecia-presentations
npx convex dev --once
```
Or configure as separate Coolify service.

### 4. Configure Domain
1. In Coolify → Resource → Settings → Domains
2. Add `aleciasite.manuora.fr`
3. Configure SSL (Let's Encrypt automatic)

### 5. Verify Deployment
- [ ] Frontend loads at aleciasite.manuora.fr
- [ ] Login/Registration works
- [ ] Can create project
- [ ] Can export to PPTX

## Troubleshooting

### Build Fails
- Check Node version (18+)
- Check npm install completed
- Check environment variables

### Convex Connection Fails
- Verify aleciaconvex.manuora.fr is running
- Check CORS settings in Convex dashboard
- Verify VITE_CONVEX_URL is correct

### 502 Errors
- Check Convex is running
- Check port configuration
- Check logs in Coolify

## Post-Deployment

### Monitoring
- Set up Sentry for error tracking
- Configure log aggregation

### Backup
- Convex data backed up automatically
- Configure additional backups if needed

## Support
For issues, check:
- Coolify logs
- Convex dashboard
- Sentry dashboard