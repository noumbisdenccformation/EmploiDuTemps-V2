class TimetableGenerator {
  constructor() {
    this.timeSlots = [
      '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '12:30-13:30', '13:30-14:30', '14:30-15:30', '15:30-16:30'
    ];
    this.days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  }

  // Générer emploi du temps par classe uniquement
  generateByClass(teachers, subjects, classes) {
    return this.generate(teachers, subjects, classes).byClass;
  }

  // Générer emploi du temps par enseignant uniquement
  generateByTeacher(teachers, subjects, classes) {
    return this.generate(teachers, subjects, classes).byTeacher;
  }

  generate(teachers, subjects, classes) {
    const result = {
      byClass: {},
      byTeacher: {},
      generatedAt: new Date().toISOString()
    };
    
    // Initialiser les grilles par classe
    classes.forEach(cls => {
      result.byClass[cls.name] = this.initializeGrid();
    });
    
    // Initialiser les grilles par enseignant
    teachers.forEach(teacher => {
      const teacherName = `${teacher.firstName} ${teacher.lastName}`;
      result.byTeacher[teacherName] = this.initializeGrid();
    });

    // Algorithme de placement amélioré - répartition sur tous les jours
    console.log('Enseignants reçus:', teachers.length);
    subjects.forEach(subject => {
      // Chercher TOUS les enseignants (y compris nouveaux) qui peuvent enseigner cette matière
      const availableTeachers = teachers.filter(t => {
        // Vérifier si l'enseignant a des matières assignées
        const hasSubjects = t.subjects && t.subjects.length > 0 && t.subjects.some(s => s.id === subject.id);
        console.log(`Enseignant ${t.firstName} ${t.lastName} peut enseigner ${subject.name}:`, hasSubjects);
        return hasSubjects;
      });
      
      console.log(`Enseignants disponibles pour ${subject.name}:`, availableTeachers.length);
      
      if (availableTeachers.length > 0) {
        console.log(`Traitement de la matière ${subject.name} avec ${availableTeachers.length} enseignants`);
        const targetClasses = classes.filter(cls => 
          cls.subjects && cls.subjects.some(s => s.id === subject.id)
        );
        
        targetClasses.forEach(cls => {
          // Calculer le nombre de créneaux nécessaires basé sur la durée
          const slotDuration = 60; // Chaque créneau = 60 minutes
          const coursesPerWeek = Math.ceil(subject.duration / slotDuration);
          let assignedCount = 0;
          
          console.log(`${subject.name}: ${subject.duration}min/semaine = ${coursesPerWeek} créneaux nécessaires`);
          
          // Forcer l'assignation sur différents jours - 1 cours par jour minimum
          for (let day of this.days) {
            if (assignedCount >= coursesPerWeek) break;
            
            // Essayer d'assigner au moins 1 cours par jour
            for (let teacher of availableTeachers) {
              if (this.assignSubjectOnDay(result, cls.name, subject, teacher, day)) {
                assignedCount++;
                console.log(`Assigné ${subject.name} pour ${cls.name} le ${day} avec ${teacher.firstName} ${teacher.lastName}`);
                break;
              }
            }
          }
          
          // Si pas assez de cours assignés, essayer de compléter
          while (assignedCount < coursesPerWeek) {
            let assigned = false;
            for (let day of this.days) {
              for (let teacher of availableTeachers) {
                if (this.assignSubjectOnDay(result, cls.name, subject, teacher, day)) {
                  assignedCount++;
                  assigned = true;
                  break;
                }
              }
              if (assigned || assignedCount >= coursesPerWeek) break;
            }
            if (!assigned) break; // Éviter boucle infinie
          }
          
          console.log(`${assignedCount} cours assignés pour ${subject.name} - ${cls.name}`);
          if (assignedCount === 0) {
            console.warn(`Impossible d'assigner ${subject.name} à la classe ${cls.name}`);
          }
        });
      } else {
        console.warn(`Aucun enseignant disponible pour ${subject.name}`);
      }
    });

    return result;
  }

  initializeGrid() {
    const grid = {};
    this.days.forEach(day => {
      grid[day] = {};
      this.timeSlots.forEach(slot => {
        grid[day][slot] = null;
      });
    });
    return grid;
  }

  assignSubject(result, className, subject, teacher) {
    const teacherName = `${teacher.firstName} ${teacher.lastName}`;
    
    // Trouver un créneau libre en respectant les disponibilités
    for (let day of this.days) {
      for (let slot of this.timeSlots) {
        if (slot === '12:00-12:30') continue; // Pause déjeuner
        
        // Vérifier les disponibilités de l'enseignant
        if (!this.isTeacherAvailable(teacher, day, slot)) continue;
        
        // Vérifier que le créneau est libre pour la classe ET l'enseignant
        if (!result.byClass[className][day][slot] && 
            !result.byTeacher[teacherName][day][slot]) {
          
          const courseInfo = {
            subject: subject.name,
            teacher: teacherName,
            class: className,
            duration: subject.duration,
            day: day,
            timeSlot: slot
          };
          
          // Assigner dans les deux grilles
          result.byClass[className][day][slot] = {
            ...courseInfo,
            type: 'class_view'
          };
          
          result.byTeacher[teacherName][day][slot] = {
            ...courseInfo,
            type: 'teacher_view'
          };
          
          return true;
        }
      }
    }
    return false;
  }

  assignSubjectOnDay(result, className, subject, teacher, targetDay) {
    const teacherName = `${teacher.firstName} ${teacher.lastName}`;
    
    // Mélanger les créneaux pour une meilleure répartition
    const shuffledSlots = [...this.timeSlots].sort(() => Math.random() - 0.5);
    
    // Chercher un créneau libre pour ce jour spécifique
    for (let slot of shuffledSlots) {
      if (slot === '12:00-12:30') continue; // Pause déjeuner
      
      // Vérifier les disponibilités de l'enseignant
      if (!this.isTeacherAvailable(teacher, targetDay, slot)) continue;
      
      // Vérifier que le créneau est libre pour la classe ET l'enseignant
      if (!result.byClass[className][targetDay][slot] && 
          !result.byTeacher[teacherName][targetDay][slot]) {
        
        const courseInfo = {
          subject: subject.name,
          teacher: teacherName,
          class: className,
          duration: subject.duration,
          day: targetDay,
          timeSlot: slot
        };
        
        // Assigner dans les deux grilles
        result.byClass[className][targetDay][slot] = {
          ...courseInfo,
          type: 'class_view'
        };
        
        result.byTeacher[teacherName][targetDay][slot] = {
          ...courseInfo,
          type: 'teacher_view'
        };
        
        return true;
      }
    }
    return false;
  }

  isTeacherAvailable(teacher, day, timeSlot) {
    // Si pas de disponibilités définies, disponible tous les jours 8h-16h30
    if (!teacher.availability || !teacher.availability[day]) {
      const [startTime] = timeSlot.split('-');
      return startTime >= '08:00' && startTime < '16:30';
    }
    
    const dayAvailability = teacher.availability[day];
    const [startTime, endTime] = timeSlot.split('-');
    
    // Vérifier si le créneau complet est dans au moins une des disponibilités
    return dayAvailability.some(slot => {
      // Le créneau doit être entièrement dans la disponibilité
      return startTime >= slot.start && endTime <= slot.end;
    });
  }

  validateTimetable(timetableData) {
    const conflicts = [];
    
    // Vérifier les conflits d'enseignants (un enseignant ne peut pas être dans 2 classes en même temps)
    Object.keys(timetableData.byTeacher).forEach(teacherName => {
      const teacherSchedule = timetableData.byTeacher[teacherName];
      
      this.days.forEach(day => {
        this.timeSlots.forEach(slot => {
          const course = teacherSchedule[day][slot];
          if (course) {
            // Vérifier si l'enseignant a d'autres cours au même moment
            const sameTimes = Object.keys(timetableData.byClass)
              .filter(className => 
                timetableData.byClass[className][day][slot] && 
                timetableData.byClass[className][day][slot].teacher === teacherName
              );
            
            if (sameTimes.length > 1) {
              conflicts.push({
                type: 'teacher_conflict',
                teacher: teacherName,
                day,
                slot,
                classes: sameTimes
              });
            }
          }
        });
      });
    });
    
    return conflicts;
  }
}

module.exports = TimetableGenerator;