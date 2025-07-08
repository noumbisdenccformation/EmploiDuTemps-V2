class ConflictResolver {
  constructor() {
    this.pendingConflicts = new Map();
  }

  // Détecter les conflits lors de la génération
  detectConflicts(teachers, subjects, classes) {
    const conflicts = [];
    
    subjects.forEach(subject => {
      const availableTeachers = teachers.filter(t => 
        t.subjects && t.subjects.some(s => s.id === subject.id)
      );
      
      const targetClasses = classes.filter(cls => 
        cls.subjects && cls.subjects.some(s => s.id === subject.id)
      );

      // Conflit si plusieurs enseignants pour une matière
      if (availableTeachers.length > 1) {
        targetClasses.forEach(cls => {
          const conflictId = `${subject.id}_${cls.id}`;
          conflicts.push({
            id: conflictId,
            type: 'teacher_choice',
            subject: subject.name,
            class: cls.name,
            availableTeachers: availableTeachers.map(t => ({
              id: t.id,
              name: `${t.firstName} ${t.lastName}`,
              availability: t.availability
            })),
            needsAdminDecision: true
          });
        });
      }
    });

    return conflicts;
  }

  // Proposer des alternatives pour modification
  getAlternatives(currentSchedule, teacherId, day, timeSlot) {
    const alternatives = [];
    
    // Créneaux libres pour cet enseignant
    const teacher = this.findTeacherById(teacherId);
    if (!teacher) return alternatives;

    const timeSlots = [
      '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '12:30-13:30', '13:30-14:30', '14:30-15:30', '15:30-16:30'
    ];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    days.forEach(d => {
      timeSlots.forEach(slot => {
        if (this.isSlotAvailable(currentSchedule, teacherId, d, slot)) {
          alternatives.push({
            day: d,
            timeSlot: slot,
            available: true,
            impact: this.calculateImpact(currentSchedule, teacherId, d, slot)
          });
        }
      });
    });

    return alternatives.sort((a, b) => a.impact - b.impact);
  }

  isSlotAvailable(schedule, teacherId, day, timeSlot) {
    // Vérifier si le créneau est libre dans le planning actuel
    const teacherName = this.getTeacherName(teacherId);
    return !(schedule.byTeacher[teacherName] && 
             schedule.byTeacher[teacherName][day] && 
             schedule.byTeacher[teacherName][day][timeSlot]);
  }

  calculateImpact(schedule, teacherId, day, timeSlot) {
    // Calculer l'impact du changement (nombre de conflits générés)
    let impact = 0;
    
    // Logique simplifiée - plus de détails selon les besoins
    if (day === 'Vendredi' && timeSlot.startsWith('15:')) impact += 2;
    if (timeSlot === '08:00-09:00') impact += 1;
    
    return impact;
  }

  findTeacherById(teacherId) {
    // À implémenter avec la vraie base de données
    return null;
  }

  getTeacherName(teacherId) {
    // À implémenter avec la vraie base de données
    return `Teacher_${teacherId}`;
  }
}

module.exports = ConflictResolver;