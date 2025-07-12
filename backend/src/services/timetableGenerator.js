class TimetableGenerator {
  constructor() {
    this.timeSlots = [
      '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '12:30-13:30', '13:30-14:30', '14:30-15:30', '15:30-16:30'
    ];
    this.days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    
    // Limites par défaut d'heures de cours
    this.defaultLimits = {
      maxHoursPerDay: 4,
      maxHoursPerWeek: 15
    };
  }

  // Générer emploi du temps par classe uniquement
  generateByClass(teachers, subjects, classes) {
    return this.generate(teachers, subjects, classes).byClass;
  }

  // Générer emploi du temps par enseignant uniquement
  generateByTeacher(teachers, subjects, classes) {
    return this.generate(teachers, subjects, classes).byTeacher;
  }

  generate(teachers, subjects, classes, rooms = [], assignments = []) {
    const result = {
      byClass: {},
      byTeacher: {},
      generatedAt: new Date().toISOString()
    };
    
    this.rooms = rooms.length > 0 ? rooms : [
      { id: 1, name: 'Salle A1', type: 'classroom' },
      { id: 2, name: 'Salle A2', type: 'classroom' },
      { id: 3, name: 'Labo', type: 'laboratory' }
    ];
    
    // Initialiser les grilles par classe
    classes.forEach(cls => {
      result.byClass[cls.name] = this.initializeGrid();
    });
    
    // Initialiser les grilles par enseignant
    teachers.forEach(teacher => {
      const teacherName = `${teacher.firstName} ${teacher.lastName}`;
      result.byTeacher[teacherName] = this.initializeGrid();
    });

    // Utiliser les affectations précises si disponibles
    if (assignments && assignments.length > 0) {
      assignments.forEach(assignment => {
        const teacher = teachers.find(t => t.id === assignment.teacherId);
        const subject = subjects.find(s => s.id === assignment.subjectId);
        const targetClass = classes.find(c => c.id === assignment.classId);
        
        if (teacher && subject && targetClass) {
          const teacherName = `${teacher.firstName} ${teacher.lastName}`;
          const coursesNeeded = Math.ceil(assignment.hoursPerWeek || subject.duration || 1);
          
          for (let i = 0; i < coursesNeeded; i++) {
            this.assignSubject(result, targetClass.name, subject, teacher, classes);
          }
        }
      });
    } else {
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
          const slotDuration = 1; // Chaque créneau = 1 heure
          const coursesPerWeek = Math.ceil(subject.duration / slotDuration);
          let assignedCount = 0;
          
          console.log(`${subject.name}: ${subject.duration}h/semaine = ${coursesPerWeek} créneaux nécessaires`);
          
          // Forcer l'assignation sur différents jours - 1 cours par jour minimum
          for (let day of this.days) {
            if (assignedCount >= coursesPerWeek) break;
            
            // Essayer d'assigner au moins 1 cours par jour
            for (let teacher of availableTeachers) {
              if (this.assignSubjectOnDay(result, cls.name, subject, teacher, day, classes)) {
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
                if (this.assignSubjectOnDay(result, cls.name, subject, teacher, day, classes)) {
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
    }

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

  // Compter les heures de cours par jour pour une classe
  countHoursPerDay(result, className, day) {
    let hours = 0;
    for (let slot of this.timeSlots) {
      const course = result.byClass[className][day][slot];
      if (course) {
        hours += 1; // Chaque créneau = 1 heure
      }
    }
    return hours;
  }

  // Compter les heures de cours par semaine pour une classe
  countHoursPerWeek(result, className) {
    let totalHours = 0;
    for (let day of this.days) {
      totalHours += this.countHoursPerDay(result, className, day);
    }
    return totalHours;
  }

  // Obtenir les limites d'heures pour une classe
  getClassLimits(className, classes) {
    const classData = classes.find(cls => cls.name === className);
    return {
      maxHoursPerDay: classData?.maxHoursPerDay || this.defaultLimits.maxHoursPerDay,
      maxHoursPerWeek: classData?.maxHoursPerWeek || this.defaultLimits.maxHoursPerWeek
    };
  }

  // Vérifier si on peut ajouter un cours en respectant les limites
  canAddCourse(result, className, classes) {
    const limits = this.getClassLimits(className, classes);
    const currentWeeklyHours = this.countHoursPerWeek(result, className);
    
    // Vérifier la limite hebdomadaire
    if (currentWeeklyHours >= limits.maxHoursPerWeek) {
      console.log(`Limite hebdomadaire atteinte pour ${className}: ${currentWeeklyHours}/${limits.maxHoursPerWeek}h`);
      return false;
    }
    
    return true;
  }

  // Vérifier si on peut ajouter un cours un jour spécifique
  canAddCourseOnDay(result, className, day, classes) {
    const limits = this.getClassLimits(className, classes);
    const currentDailyHours = this.countHoursPerDay(result, className, day);
    const currentWeeklyHours = this.countHoursPerWeek(result, className);
    
    // Vérifier la limite quotidienne
    if (currentDailyHours >= limits.maxHoursPerDay) {
      console.log(`Limite quotidienne atteinte pour ${className} le ${day}: ${currentDailyHours}/${limits.maxHoursPerDay}h`);
      return false;
    }
    
    // Vérifier la limite hebdomadaire
    if (currentWeeklyHours >= limits.maxHoursPerWeek) {
      console.log(`Limite hebdomadaire atteinte pour ${className}: ${currentWeeklyHours}/${limits.maxHoursPerWeek}h`);
      return false;
    }
    
    return true;
  }

  assignSubject(result, className, subject, teacher, classes) {
    const teacherName = `${teacher.firstName} ${teacher.lastName}`;
    // Vérifier les limites globales avant de chercher un créneau
    if (!this.canAddCourse(result, className, classes)) {
      console.log(`Impossible d'assigner ${subject.name} à ${className}: limites hebdomadaires atteintes`);
      return false;
    }
    for (let day of this.days) {
      // Vérifier les limites pour ce jour
      const limits = this.getClassLimits(className, classes);
      const currentDailyHours = this.countHoursPerDay(result, className, day);
      const currentWeeklyHours = this.countHoursPerWeek(result, className);
      console.log(`[DEBUG] Tentative de placement de ${subject.name} pour ${className} le ${day} : ${currentDailyHours}h déjà placées (limite ${limits.maxHoursPerDay}), ${currentWeeklyHours}h semaine (limite ${limits.maxHoursPerWeek})`);
      if (!this.canAddCourseOnDay(result, className, day, classes)) {
        continue;
      }
      for (let slot of this.timeSlots) {
        if (slot === '12:00-12:30') continue; // Pause déjeuner
        if (!this.isTeacherAvailable(teacher, day, slot)) continue;
        if (!result.byClass[className][day][slot] && !result.byTeacher[teacherName][day][slot]) {
          // Vérification FINALE juste avant placement
          const afterDaily = this.countHoursPerDay(result, className, day) + 1;
          const afterWeekly = this.countHoursPerWeek(result, className) + 1;
          if (afterDaily > limits.maxHoursPerDay) {
            console.log(`[REFUS] ${subject.name} pour ${className} le ${day} : dépasserait la limite quotidienne (${afterDaily}/${limits.maxHoursPerDay})`);
            continue;
          }
          if (afterWeekly > limits.maxHoursPerWeek) {
            console.log(`[REFUS] ${subject.name} pour ${className} semaine : dépasserait la limite hebdo (${afterWeekly}/${limits.maxHoursPerWeek})`);
            continue;
          }
          const courseInfo = {
            subject: subject.name,
            teacher: teacherName,
            class: className,
            duration: subject.duration,
            day: day,
            timeSlot: slot,
            room: this.assignRoom(subject, className)
          };
          result.byClass[className][day][slot] = {
            ...courseInfo,
            type: 'class_view'
          };
          result.byTeacher[teacherName][day][slot] = {
            ...courseInfo,
            type: 'teacher_view'
          };
          console.log(`[OK] Assigné ${subject.name} à ${className} le ${day} ${slot} (${this.countHoursPerDay(result, className, day)}h/jour, ${this.countHoursPerWeek(result, className)}h/semaine)`);
          return true;
        }
      }
    }
    return false;
  }

  assignSubjectOnDay(result, className, subject, teacher, targetDay, classes) {
    const teacherName = `${teacher.firstName} ${teacher.lastName}`;
    const limits = this.getClassLimits(className, classes);
    const currentDailyHours = this.countHoursPerDay(result, className, targetDay);
    const currentWeeklyHours = this.countHoursPerWeek(result, className);
    console.log(`[DEBUG] Tentative de placement (OnDay) de ${subject.name} pour ${className} le ${targetDay} : ${currentDailyHours}h déjà placées (limite ${limits.maxHoursPerDay}), ${currentWeeklyHours}h semaine (limite ${limits.maxHoursPerWeek})`);
    if (!this.canAddCourseOnDay(result, className, targetDay, classes)) {
      return false;
    }
    // Vérifier la limite par jour pour cette matière
    const maxPerDay = subject.maxPerDay || 2;
    const currentCountForDay = this.countSubjectInDay(result, className, subject.name, targetDay);
    if (currentCountForDay >= maxPerDay) {
      console.log(`[REFUS] Limite atteinte pour ${subject.name} le ${targetDay}: ${currentCountForDay}/${maxPerDay}`);
      return false;
    }
    const shuffledSlots = [...this.timeSlots].sort(() => Math.random() - 0.5);
    for (let slot of shuffledSlots) {
      if (slot === '12:00-12:30') continue;
      if (!this.isTeacherAvailable(teacher, targetDay, slot)) continue;
      if (!result.byClass[className][targetDay][slot] && !result.byTeacher[teacherName][targetDay][slot]) {
        // Vérification FINALE juste avant placement
        const afterDaily = this.countHoursPerDay(result, className, targetDay) + 1;
        const afterWeekly = this.countHoursPerWeek(result, className) + 1;
        if (afterDaily > limits.maxHoursPerDay) {
          console.log(`[REFUS] ${subject.name} pour ${className} le ${targetDay} : dépasserait la limite quotidienne (${afterDaily}/${limits.maxHoursPerDay})`);
          continue;
        }
        if (afterWeekly > limits.maxHoursPerWeek) {
          console.log(`[REFUS] ${subject.name} pour ${className} semaine : dépasserait la limite hebdo (${afterWeekly}/${limits.maxHoursPerWeek})`);
          continue;
        }
        const courseInfo = {
          subject: subject.name,
          teacher: teacherName,
          class: className,
          duration: subject.duration,
          day: targetDay,
          timeSlot: slot,
          room: this.assignRoom(subject, className)
        };
        result.byClass[className][targetDay][slot] = {
          ...courseInfo,
          type: 'class_view'
        };
        result.byTeacher[teacherName][targetDay][slot] = {
          ...courseInfo,
          type: 'teacher_view'
        };
        console.log(`[OK] Assigné ${subject.name} à ${className} le ${targetDay} ${slot} (${this.countHoursPerDay(result, className, targetDay)}h/jour, ${this.countHoursPerWeek(result, className)}h/semaine)`);
        return true;
      }
    }
    return false;
  }

  countSubjectInDay(result, className, subjectName, day) {
    let count = 0;
    for (let slot of this.timeSlots) {
      const course = result.byClass[className][day][slot];
      if (course && course.subject === subjectName) {
        count++;
      }
    }
    return count;
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
    return Array.isArray(dayAvailability) ? 
      dayAvailability.some(slot => startTime >= slot.start && endTime <= slot.end) :
      startTime >= dayAvailability.start && endTime <= dayAvailability.end;
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

  // Valider le respect des limites d'heures par classe
  validateHoursLimits(timetableData, classes) {
    const validation = {
      isValid: true,
      violations: [],
      summary: {}
    };

    Object.keys(timetableData.byClass).forEach(className => {
      const limits = this.getClassLimits(className, classes);
      const weeklyHours = this.countHoursPerWeek(timetableData, className);
      const dailyHours = {};
      
      // Compter les heures par jour
      this.days.forEach(day => {
        dailyHours[day] = this.countHoursPerDay(timetableData, className, day);
      });

      const classValidation = {
        className,
        limits,
        actual: {
          weeklyHours,
          dailyHours
        },
        violations: []
      };

      // Vérifier la limite hebdomadaire
      if (weeklyHours > limits.maxHoursPerWeek) {
        classValidation.violations.push({
          type: 'weekly_limit_exceeded',
          limit: limits.maxHoursPerWeek,
          actual: weeklyHours,
          excess: weeklyHours - limits.maxHoursPerWeek
        });
        validation.isValid = false;
      }

      // Vérifier les limites quotidiennes
      this.days.forEach(day => {
        if (dailyHours[day] > limits.maxHoursPerDay) {
          classValidation.violations.push({
            type: 'daily_limit_exceeded',
            day,
            limit: limits.maxHoursPerDay,
            actual: dailyHours[day],
            excess: dailyHours[day] - limits.maxHoursPerDay
          });
          validation.isValid = false;
        }
      });

      validation.summary[className] = classValidation;
      validation.violations.push(...classValidation.violations);
    });

    return validation;
  }

  // Générer un rapport détaillé des heures par classe
  generateHoursReport(timetableData, classes) {
    const report = {
      generatedAt: new Date().toISOString(),
      classes: {}
    };

    Object.keys(timetableData.byClass).forEach(className => {
      const limits = this.getClassLimits(className, classes);
      const weeklyHours = this.countHoursPerWeek(timetableData, className);
      const dailyHours = {};
      
      this.days.forEach(day => {
        dailyHours[day] = this.countHoursPerDay(timetableData, className, day);
      });

      report.classes[className] = {
        limits,
        actual: {
          weeklyHours,
          dailyHours
        },
        compliance: {
          weekly: weeklyHours <= limits.maxHoursPerWeek,
          daily: this.days.every(day => dailyHours[day] <= limits.maxHoursPerDay)
        },
        utilization: {
          weekly: Math.round((weeklyHours / limits.maxHoursPerWeek) * 100),
          daily: this.days.map(day => ({
            day,
            utilization: Math.round((dailyHours[day] / limits.maxHoursPerDay) * 100)
          }))
        }
      };
    });

    return report;
  }

  assignRoom(subject, className) {
    if (!this.rooms || this.rooms.length === 0) {
      return 'Salle non assignée';
    }
    
    // 1. Chercher une salle unique assignée à cette classe
    const uniqueRoom = this.rooms.find(r => 
      r.status === 'unique' && r.assignedClass === className
    );
    if (uniqueRoom) return uniqueRoom.name;
    
    // 2. Pour les laboratoires, utiliser les salles communes de type laboratory
    if (subject.name.toLowerCase().includes('chimie') || 
        subject.name.toLowerCase().includes('physique') ||
        subject.name.toLowerCase().includes('biologie')) {
      const lab = this.rooms.find(r => r.type === 'laboratory' && r.status === 'commune');
      if (lab) return lab.name;
    }
    
    // 3. Pour les cours magistraux, utiliser l'amphi si disponible
    if (subject.name.toLowerCase().includes('conférence') || 
        subject.name.toLowerCase().includes('magistral')) {
      const amphi = this.rooms.find(r => r.type === 'amphitheater' && r.status === 'commune');
      if (amphi) return amphi.name;
    }
    
    // 4. Utiliser les salles de classe communes disponibles
    const availableClassrooms = this.rooms.filter(r => 
      r.type === 'classroom' && (r.status === 'commune' || !r.assignedClass)
    );
    
    if (availableClassrooms.length > 0) {
      const index = className.length % availableClassrooms.length;
      return availableClassrooms[index].name;
    }
    
    return this.rooms[0].name;
  }
}

module.exports = TimetableGenerator;