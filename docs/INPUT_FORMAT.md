# Format des Données d'Entrée

## Structure Requise pour la Génération

### 📋 **Enseignants** (teachers)
```json
[
  {
    "id": 1,
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@school.fr",
    "availability": {
      "Lundi": [
        {"start": "08:00", "end": "12:00"},
        {"start": "13:30", "end": "16:30"}
      ],
      "Mardi": [
        {"start": "08:00", "end": "16:30"}
      ]
    },
    "subjects": [
      {"id": 1, "name": "Mathématiques"}
    ]
  }
]
```

### 📚 **Matières** (subjects)
```json
[
  {
    "id": 1,
    "name": "Mathématiques",
    "code": "MATH",
    "duration": 60,
    "isCommonCore": false
  },
  {
    "id": 2,
    "name": "Français",
    "code": "FR",
    "duration": 60,
    "isCommonCore": true
  }
]
```

### 🏫 **Classes** (classes)
```json
[
  {
    "id": 1,
    "name": "6ème A",
    "level": "6ème",
    "studentCount": 25,
    "subjects": [
      {"id": 1, "name": "Mathématiques"},
      {"id": 2, "name": "Français"}
    ]
  }
]
```

## 🚀 Exemple d'Appel API

```bash
curl -X POST http://localhost:3000/api/timetables/generate \
  -H "Content-Type: application/json" \
  -d '{
    "teachers": [
      {
        "id": 1,
        "firstName": "Jean",
        "lastName": "Dupont",
        "availability": {
          "Lundi": [{"start": "08:00", "end": "16:30"}],
          "Mardi": [{"start": "08:00", "end": "12:00"}]
        },
        "subjects": [{"id": 1}]
      }
    ],
    "subjects": [
      {
        "id": 1,
        "name": "Mathématiques",
        "duration": 60
      }
    ],
    "classes": [
      {
        "id": 1,
        "name": "6ème A",
        "subjects": [{"id": 1}]
      }
    ]
  }'
```

## ⚡ Logique de Génération

1. **Analyse des disponibilités** des enseignants
2. **Matching** matières ↔ enseignants ↔ classes
3. **Placement intelligent** en évitant les conflits
4. **Génération simultanée** des vues par classe ET par enseignant