# API Endpoints - Emploi du Temps

## Génération d'Emploi du Temps

### Génération Complète
```
POST /api/timetables/generate
```
Génère les emplois du temps pour **toutes les classes** ET **tous les enseignants**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "byClass": {
      "6ème A": {
        "Lundi": {
          "08:00-09:00": {
            "subject": "Mathématiques",
            "teacher": "Jean Dupont",
            "class": "6ème A",
            "duration": 60
          }
        }
      }
    },
    "byTeacher": {
      "Jean Dupont": {
        "Lundi": {
          "08:00-09:00": {
            "subject": "Mathématiques",
            "teacher": "Jean Dupont",
            "class": "6ème A",
            "duration": 60
          }
        }
      }
    }
  }
}
```

### Génération par Classe Uniquement
```
POST /api/timetables/generate/by-class
```
Génère uniquement les emplois du temps **par classe**

### Génération par Enseignant Uniquement
```
POST /api/timetables/generate/by-teacher
```
Génère uniquement les emplois du temps **par enseignant**

### Validation
```
POST /api/timetables/validate
```
Valide un emploi du temps et détecte les conflits

**Body :**
```json
{
  "timetableData": {
    "byClass": {...},
    "byTeacher": {...}
  }
}
```

## Tests

```bash
# Génération complète
curl -X POST http://localhost:3000/api/timetables/generate

# Par classe seulement
curl -X POST http://localhost:3000/api/timetables/generate/by-class

# Par enseignant seulement  
curl -X POST http://localhost:3000/api/timetables/generate/by-teacher
```