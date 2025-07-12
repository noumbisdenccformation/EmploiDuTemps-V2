const TimetableGenerator = require('./src/services/timetableGenerator');

// Données de test
const teachers = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@school.fr',
    subjects: [{ id: 1 }, { id: 2 }]
  },
  {
    id: 2,
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@school.fr',
    subjects: [{ id: 3 }, { id: 4 }]
  },
  {
    id: 3,
    firstName: 'Pierre',
    lastName: 'Durand',
    email: 'pierre.durand@school.fr',
    subjects: [{ id: 1 }, { id: 5 }]
  }
];

const subjects = [
  { id: 1, name: 'Mathématiques', duration: 4, maxPerDay: 2 },
  { id: 2, name: 'Français', duration: 3, maxPerDay: 2 },
  { id: 3, name: 'Histoire', duration: 2, maxPerDay: 1 },
  { id: 4, name: 'Géographie', duration: 2, maxPerDay: 1 },
  { id: 5, name: 'Sciences', duration: 3, maxPerDay: 2 }
];

const classes = [
  {
    id: 1,
    name: '6ème A',
    level: '6ème',
    maxHoursPerDay: 4,    // Limite personnalisée
    maxHoursPerWeek: 15,  // Limite personnalisée
    subjects: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
  },
  {
    id: 2,
    name: '6ème B',
    level: '6ème',
    // Utilise les limites par défaut (4h/jour, 15h/semaine)
    subjects: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
  }
];

console.log('🧪 Test des limites d\'heures de cours');
console.log('=====================================\n');

// Test 1: Génération avec limites respectées
console.log('📚 Test 1: Génération avec limites respectées');
const generator = new TimetableGenerator();
const result = generator.generate(teachers, subjects, classes);

console.log('\n📊 Résultats de la génération:');
Object.keys(result.byClass).forEach(className => {
  const weeklyHours = generator.countHoursPerWeek(result, className);
  const limits = generator.getClassLimits(className, classes);
  
  console.log(`\n🏫 ${className}:`);
  console.log(`   Limites: ${limits.maxHoursPerDay}h/jour, ${limits.maxHoursPerWeek}h/semaine`);
  console.log(`   Heures assignées: ${weeklyHours}h/semaine`);
  
  // Afficher les heures par jour
  generator.days.forEach(day => {
    const dailyHours = generator.countHoursPerDay(result, className, day);
    console.log(`   ${day}: ${dailyHours}h`);
  });
  
  // Vérifier le respect des limites
  const isValid = weeklyHours <= limits.maxHoursPerWeek && 
                  generator.days.every(day => 
                    generator.countHoursPerDay(result, className, day) <= limits.maxHoursPerDay
                  );
  
  console.log(`   ✅ Respect des limites: ${isValid ? 'OUI' : 'NON'}`);
});

// Test 2: Validation des limites
console.log('\n\n🔍 Test 2: Validation des limites');
const validation = generator.validateHoursLimits(result, classes);
console.log(`Validation globale: ${validation.isValid ? '✅ VALIDE' : '❌ INVALIDE'}`);

if (!validation.isValid) {
  console.log('\n❌ Violations détectées:');
  validation.violations.forEach(violation => {
    if (violation.type === 'weekly_limit_exceeded') {
      console.log(`   ${violation.className}: Limite hebdomadaire dépassée (${violation.actual}h > ${violation.limit}h)`);
    } else if (violation.type === 'daily_limit_exceeded') {
      console.log(`   ${violation.className} le ${violation.day}: Limite quotidienne dépassée (${violation.actual}h > ${violation.limit}h)`);
    }
  });
}

// Test 3: Rapport détaillé
console.log('\n\n📋 Test 3: Rapport détaillé');
const report = generator.generateHoursReport(result, classes);
console.log(JSON.stringify(report, null, 2));

// Test 4: Test avec des limites plus strictes
console.log('\n\n🧪 Test 4: Test avec des limites plus strictes');
const strictClasses = classes.map(cls => ({
  ...cls,
  maxHoursPerDay: 3,
  maxHoursPerWeek: 12
}));

const strictResult = generator.generate(teachers, subjects, strictClasses);
const strictValidation = generator.validateHoursLimits(strictResult, strictClasses);

console.log(`Validation avec limites strictes: ${strictValidation.isValid ? '✅ VALIDE' : '❌ INVALIDE'}`);

if (!strictValidation.isValid) {
  console.log('\n❌ Violations avec limites strictes:');
  strictValidation.violations.forEach(violation => {
    console.log(`   ${violation.className}: ${violation.type} - ${violation.excess}h en excès`);
  });
}

console.log('\n✅ Tests terminés !'); 