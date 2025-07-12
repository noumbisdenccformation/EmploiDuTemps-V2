# Limites d'Heures de Cours

## Vue d'ensemble

Le système de génération d'emploi du temps respecte maintenant automatiquement les limites d'heures de cours par jour et par semaine pour chaque classe. Cela garantit des emplois du temps homogènes et utilisables.

## Limites par défaut

- **4 heures maximum par jour** par classe
- **15 heures maximum par semaine** par classe

## Configuration personnalisée

### Via l'objet `classes`

Vous pouvez personnaliser les limites pour chaque classe en ajoutant les propriétés suivantes :

```javascript
const classes = [
  {
    id: 1,
    name: '6ème A',
    level: '6ème',
    maxHoursPerDay: 5,    // Limite personnalisée : 5h/jour
    maxHoursPerWeek: 20,  // Limite personnalisée : 20h/semaine
    subjects: [...]
  },
  {
    id: 2,
    name: '6ème B',
    level: '6ème',
    // Utilise les limites par défaut (4h/jour, 15h/semaine)
    subjects: [...]
  }
];
```

## API Endpoints

### 1. Génération d'emploi du temps avec validation

**POST** `/api/timetables/generate`

```javascript
{
  "teachers": [...],
  "subjects": [...],
  "classes": [
    {
      "id": 1,
      "name": "6ème A",
      "maxHoursPerDay": 4,
      "maxHoursPerWeek": 15,
      "subjects": [...]
    }
  ],
  "rooms": [...],
  "assignments": [...]
}
```

**Réponse :**
```javascript
{
  "success": true,
  "data": {
    "byClass": {...},
    "byTeacher": {...}
  },
  "hoursValidation": {
    "isValid": true,
    "violations": [],
    "summary": {
      "6ème A": {
        "className": "6ème A",
        "limits": {
          "maxHoursPerDay": 4,
          "maxHoursPerWeek": 15
        },
        "actual": {
          "weeklyHours": 14,
          "dailyHours": {
            "Lundi": 4,
            "Mardi": 4,
            "Mercredi": 3,
            "Jeudi": 2,
            "Vendredi": 1
          }
        },
        "violations": []
      }
    }
  },
  "hoursReport": {
    "generatedAt": "2025-07-12T10:14:18.557Z",
    "classes": {
      "6ème A": {
        "limits": {...},
        "actual": {...},
        "compliance": {
          "weekly": true,
          "daily": true
        },
        "utilization": {
          "weekly": 93, // 93% d'utilisation hebdomadaire
          "daily": [
            {
              "day": "Lundi",
              "utilization": 100 // 100% d'utilisation le lundi
            }
          ]
        }
      }
    }
  }
}
```

### 2. Validation spécifique des limites d'heures

**POST** `/api/timetables/validate/hours-limits`

```javascript
{
  "timetableData": {
    "byClass": {...},
    "byTeacher": {...}
  },
  "classes": [...]
}
```

## Comportement du générateur

### Vérifications automatiques

1. **Avant chaque assignation de cours**, le système vérifie :
   - La limite quotidienne pour la classe et le jour
   - La limite hebdomadaire pour la classe

2. **Si une limite est atteinte**, le cours n'est pas assigné et le système :
   - Log un message d'avertissement
   - Continue avec le cours suivant
   - Essaie d'autres créneaux ou jours

### Messages de log

```
Limite quotidienne atteinte pour 6ème A le Lundi: 4/4h
Limite hebdomadaire atteinte pour 6ème A: 15/15h
Assigné Mathématiques à 6ème A le Mardi 09:00-10:00 (2h/jour, 5h/semaine)
```

## Exemples d'utilisation

### Exemple 1 : Limites par défaut

```javascript
const classes = [
  {
    id: 1,
    name: '6ème A',
    level: '6ème',
    subjects: [
      { id: 1, name: 'Mathématiques', duration: 4 },
      { id: 2, name: 'Français', duration: 3 },
      { id: 3, name: 'Histoire', duration: 2 }
    ]
  }
];
// Utilise automatiquement 4h/jour et 15h/semaine
```

### Exemple 2 : Limites personnalisées

```javascript
const classes = [
  {
    id: 1,
    name: 'Terminale S',
    level: 'Terminale',
    maxHoursPerDay: 6,    // Plus d'heures par jour
    maxHoursPerWeek: 25,  // Plus d'heures par semaine
    subjects: [
      { id: 1, name: 'Mathématiques', duration: 6 },
      { id: 2, name: 'Physique', duration: 4 },
      { id: 3, name: 'Chimie', duration: 3 }
    ]
  }
];
```

### Exemple 3 : Classes avec contraintes différentes

```javascript
const classes = [
  {
    id: 1,
    name: '6ème A',
    maxHoursPerDay: 4,
    maxHoursPerWeek: 15,
    subjects: [...]
  },
  {
    id: 2,
    name: '6ème B',
    maxHoursPerDay: 5,    // Plus flexible
    maxHoursPerWeek: 18,  // Plus d'heures
    subjects: [...]
  },
  {
    id: 3,
    name: '6ème C',
    // Utilise les limites par défaut
    subjects: [...]
  }
];
```

## Validation et rapports

### Types de violations

1. **`weekly_limit_exceeded`** : Limite hebdomadaire dépassée
2. **`daily_limit_exceeded`** : Limite quotidienne dépassée

### Exemple de violation

```javascript
{
  "type": "daily_limit_exceeded",
  "className": "6ème A",
  "day": "Lundi",
  "limit": 4,
  "actual": 5,
  "excess": 1
}
```

## Bonnes pratiques

1. **Définir des limites réalistes** selon l'âge et le niveau des élèves
2. **Vérifier les rapports** après génération pour optimiser
3. **Ajuster progressivement** les limites si nécessaire
4. **Considérer les pauses** et la fatigue des élèves

## Migration depuis l'ancienne version

Si vous utilisez une version antérieure du système :

1. **Aucun changement requis** - les limites par défaut s'appliquent automatiquement
2. **Optionnel** : Ajoutez `maxHoursPerDay` et `maxHoursPerWeek` aux objets `classes` pour personnaliser
3. **Nouveau** : Utilisez les endpoints de validation pour vérifier le respect des limites

## Test de la fonctionnalité

Exécutez le test intégré :

```bash
cd backend
node test-hours-limits.js
```

Ce test vérifie :
- Le respect des limites par défaut
- Le respect des limites personnalisées
- La génération de rapports détaillés
- La détection des violations 