const TimetableGenerator = require('./src/services/timetableGenerator');

// Données de test reproduisant le problème
const teachers = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@school.fr',
    subjects: [{ id: 1 }]
  },
  {
    id: 2,
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@school.fr',
    subjects: [{ id: 2 }]
  }
];

const subjects = [
  { id: 1, name: 'anglais', duration: 4, maxPerDay: 2 },
  { id: 2, name: 'francais', duration: 3, maxPerDay: 2 }
];

const classes = [
  {
    id: 1,
    name: '6ème A',
    level: '6ème',
    maxHoursPerDay: 4,    // Limite de 4h/jour
    maxHoursPerWeek: 15,  // Limite de 15h/semaine
    subjects: [{ id: 1 }, { id: 2 }]
  }
];

console.log('🔍 Test de débogage des limites d\'heures');
console.log('========================================\n');

console.log('📋 Données d\'entrée:');
console.log('Classes:', JSON.stringify(classes, null, 2));
console.log('Matières:', JSON.stringify(subjects, null, 2));
console.log('Enseignants:', JSON.stringify(teachers, null, 2));

const generator = new TimetableGenerator();
const result = generator.generate(teachers, subjects, classes);

console.log('\n📊 Résultat de la génération:');
console.log('Classes générées:', Object.keys(result.byClass));

// Analyser chaque classe
Object.keys(result.byClass).forEach(className => {
  console.log(`\n🏫 Analyse de ${className}:`);
  
  const limits = generator.getClassLimits(className, classes);
  console.log(`   Limites configurées: ${limits.maxHoursPerDay}h/jour, ${limits.maxHoursPerWeek}h/semaine`);
  
  // Analyser chaque jour
  generator.days.forEach(day => {
    const dailyHours = generator.countHoursPerDay(result, className, day);
    const weeklyHours = generator.countHoursPerWeek(result, className);
    
    console.log(`   ${day}: ${dailyHours}h (limite: ${limits.maxHoursPerDay}h) - ${dailyHours > limits.maxHoursPerDay ? '❌ DÉPASSÉ' : '✅ OK'}`);
    
    // Afficher les cours du jour
    generator.timeSlots.forEach(slot => {
      const course = result.byClass[className][day][slot];
      if (course) {
        console.log(`     ${slot}: ${course.subject} (${course.teacher})`);
      }
    });
  });
  
  const totalWeeklyHours = generator.countHoursPerWeek(result, className);
  console.log(`   Total semaine: ${totalWeeklyHours}h (limite: ${limits.maxHoursPerWeek}h) - ${totalWeeklyHours > limits.maxHoursPerWeek ? '❌ DÉPASSÉ' : '✅ OK'}`);
});

// Validation des limites
console.log('\n🔍 Validation des limites:');
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

// Test de la méthode getClassLimits
console.log('\n🔧 Test de getClassLimits:');
const testLimits = generator.getClassLimits('6ème A', classes);
console.log('Limites pour 6ème A:', testLimits);

// Test de la méthode countHoursPerDay
console.log('\n🔧 Test de countHoursPerDay:');
generator.days.forEach(day => {
  const hours = generator.countHoursPerDay(result, '6ème A', day);
  console.log(`${day}: ${hours}h`);
});

console.log('\n✅ Test de débogage terminé'); 