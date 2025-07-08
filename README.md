# Application de Génération d'Emploi du Temps Scolaire

## Architecture
- **Backend**: Node.js/Express + PostgreSQL
- **Frontend**: Angular
- **Déploiement**: Vercel (frontend) + Render (backend)

## Structure du Projet
```
EmploiDuTemps-scolaire/
├── backend/          # API Node.js/Express
├── frontend/         # Application Angular
└── docs/            # Documentation
```

## Installation et Développement

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

## Fonctionnalités Principales
- Gestion des enseignants et leurs disponibilités
- Gestion des matières et classes
- Génération automatique d'emploi du temps
- Interface de visualisation et modification
- Export des emplois du temps