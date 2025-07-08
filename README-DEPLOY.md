# Déploiement Emploi du Temps

## Backend - Render
1. Connectez votre GitHub à Render
2. Créez un nouveau Web Service
3. Sélectionnez ce repository
4. Configuration :
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node.js

## Frontend - Vercel
1. Connectez votre GitHub à Vercel
2. Importez ce repository
3. Configuration :
   - Framework: Angular
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Variables d'environnement
- Backend: Aucune requise pour cette version
- Frontend: Mettre à jour l'URL API dans `auth.service.ts`