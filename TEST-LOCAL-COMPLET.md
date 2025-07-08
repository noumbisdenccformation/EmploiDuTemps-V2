# 🧪 TEST LOCAL COMPLET

## 📋 **CHECKLIST DE TESTS**

### 1️⃣ **Vérification des Serveurs**
- [ ] Backend actif sur http://localhost:3000
- [ ] Frontend actif sur http://localhost:4200
- [ ] Base de données PostgreSQL connectée

### 2️⃣ **Test Backend API**
- [ ] GET /api/teachers (liste enseignants)
- [ ] POST /api/teachers (créer enseignant)
- [ ] GET /api/subjects (liste matières)
- [ ] POST /api/subjects (créer matière)
- [ ] GET /api/classes (liste classes)
- [ ] POST /api/classes (créer classe)
- [ ] POST /api/timetables/generate (génération)

### 3️⃣ **Test Frontend Interface**
- [ ] Page d'accueil accessible
- [ ] Navigation fonctionnelle
- [ ] Saisie des enseignants
- [ ] Saisie des matières
- [ ] Saisie des classes
- [ ] Génération d'emploi du temps
- [ ] Visualisation des résultats

### 4️⃣ **Test Fonctionnalités**
- [ ] Création de données complètes
- [ ] Génération sans erreur
- [ ] Affichage des emplois du temps
- [ ] Détection de conflits

## 🚀 **COMMANDES DE TEST**

```bash
# Test Backend
curl http://localhost:3000
curl http://localhost:3000/api/teachers

# Test Génération
curl -X POST http://localhost:3000/api/timetables/generate \
  -H "Content-Type: application/json" \
  -d @backend/test-simple.json
```

## 🎯 **RÉSULTATS ATTENDUS**
- ✅ Serveurs démarrés
- ✅ API répondant
- ✅ Interface accessible
- ✅ Génération fonctionnelle