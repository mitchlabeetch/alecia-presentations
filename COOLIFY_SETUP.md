# Coolify Setup Guide for Alecia Presentations

## Step 1: Create Coolify Account
1. Access Coolify at your-instance.com
2. Create team/organization

## Step 2: Add Git Provider
1. Settings -> Git Sources
2. Add GitHub/GitLab
3. Authorize repositories

## Step 3: Create New Application

### Frontend App
1. New Resource -> Application
2. Repository: your-org/alecia-presentations
3. Branch: main
4. Build Pack: Nixpacks (Node 18)
5. Pre-deploy: npm install
6. Deploy: npm run build
7. Port: 3000
8. Environment Variables:
   - VITE_CONVEX_URL=https://aleciaconvex.manuora.fr
   - NODE_ENV=production

### Backend (Convex) - Optional Separate
If deploying Convex separately:
1. New Resource -> Application
2. Repository: your-org/alecia-presentations
3. Branch: main
4. Build Command: npx convex dev --once
5. Or use Convex Cloud instead

## Step 4: Configure Domain
1. Resource -> Settings -> Domains
2. Add: aleciasite.manuora.fr
3. Enable SSL

## Step 5: Configure Health Check
1. Health Check Path: /
2. Port: 3000
3. Interval: 30s

## Step 6: Set Resource Limits
- Memory: 512MB (frontend)
- Memory: 1GB (Convex if self-hosted)

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| VITE_CONVEX_URL | https://aleciaconvex.manuora.fr | Yes |
| VITE_SENTRY_DSN | https://...@sentry.io/... | No |
| NODE_ENV | production | Yes |