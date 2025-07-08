# Prochaines Étapes de Développement

## Structure Créée ✅

### Backend (Node.js/Express)
- Configuration serveur Express avec sécurité (helmet, cors, rate limiting)
- Configuration base de données PostgreSQL avec Sequelize
- Modèles de base : Teacher, Subject, Class avec associations
- Structure des dossiers organisée

### Frontend (Angular)
- Configuration Angular avec Material Design
- Structure de navigation avec sidenav
- Services API génériques
- Modèles TypeScript pour les entités
- Configuration des environnements

## Prochaines Étapes à Implémenter

### Phase 1 : Finalisation des Modèles et API (1-2 semaines)

#### Backend
1. **Compléter les modèles Sequelize**
   - Modèle Timetable pour les emplois du temps générés
   - Modèle TimeSlot pour les créneaux horaires
   - Migrations de base de données

2. **Implémenter les contrôleurs CRUD**
   - `src/controllers/teacherController.js`
   - `src/controllers/subjectController.js`
   - `src/controllers/classController.js`
   - `src/controllers/timetableController.js`

3. **Créer les routes API**
   - `src/routes/teachers.js`
   - `src/routes/subjects.js`
   - `src/routes/classes.js`
   - `src/routes/timetables.js`

#### Frontend
1. **Créer les composants principaux**
   - DashboardComponent
   - TeachersComponent avec formulaires
   - SubjectsComponent
   - ClassesComponent
   - TimetableComponent

2. **Implémenter les services métier**
   - TeacherService
   - SubjectService
   - ClassService
   - TimetableService

### Phase 2 : Algorithme de Génération (2-3 semaines)

1. **Développer le moteur de génération**
   - `src/services/timetableGenerator.js`
   - Algorithme de résolution de contraintes
   - Gestion des disponibilités enseignants
   - Respect des créneaux fixes (pause déjeuner)
   - Jumelage des classes pour tronc commun

2. **Interface de génération**
   - Composant de configuration de génération
   - Visualisation des conflits
   - Modification manuelle des créneaux

### Phase 3 : Tests et Optimisation (1-2 semaines)

1. **Tests Backend**
   - Tests unitaires avec Jest
   - Tests d'intégration API

2. **Tests Frontend**
   - Tests unitaires composants
   - Tests e2e avec Cypress

### Phase 4 : Déploiement

1. **Configuration pour production**
   - Variables d'environnement Render/Vercel
   - Configuration base de données PostgreSQL cloud
   - Scripts de build et déploiement

## Commandes pour Démarrer

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

## Base de Données

Créer une base PostgreSQL locale :
```sql
CREATE DATABASE emploi_temps_db;
```

Ou utiliser un service cloud comme Supabase ou Railway pour PostgreSQL.