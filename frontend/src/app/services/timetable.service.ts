import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  private endpoint = '/timetables';
  private lastGeneratedResult: any = null;

  constructor(private api: ApiService) {}

  generate(data: any): Observable<any> {
    // Essayer d'abord le backend, puis fallback local
    return this.api.post(`${this.endpoint}/generate`, data).pipe(
      catchError(error => {
        console.warn('Backend non disponible, génération locale:', error);
        return of(this.generateLocally(data));
      })
    );
  }

  private generateLocally(data: any): any {
    const result = {
      success: true,
      data: {
        byClass: {},
        byTeacher: {}
      },
      summary: {
        classesCount: data.classes?.length || 0,
        teachersCount: data.teachers?.length || 0,
        subjectsProcessed: data.subjects?.length || 0,
        conflictsDetected: 0
      },
      conflicts: {
        count: 0,
        detected: []
      }
    };

    const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '13:30-14:30', '14:30-15:30', '15:30-16:30'];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    // Initialiser les grilles
    data.classes?.forEach((classe: any) => {
      result.data.byClass[classe.name] = {};
      days.forEach(day => {
        result.data.byClass[classe.name][day] = {};
      });
    });

    data.teachers?.forEach((teacher: any) => {
      const teacherName = `${teacher.firstName} ${teacher.lastName}`;
      result.data.byTeacher[teacherName] = {};
      days.forEach(day => {
        result.data.byTeacher[teacherName][day] = {};
      });
    });

    // ALGORITHME FINAL : Placement correct des cours
    data.assignments?.forEach((assignment: any) => {
      const teacher = data.teachers?.find((t: any) => t.id === assignment.teacherId);
      const subject = data.subjects?.find((s: any) => s.id === assignment.subjectId);
      const classe = data.classes?.find((c: any) => c.id === assignment.classId);

      if (teacher && subject && classe) {
        const teacherName = `${teacher.firstName} ${teacher.lastName}`;
        const hoursPerWeek = assignment.hoursPerWeek || 1;
        const maxPerDay = subject.maxPerDay || 2;
        
        let totalPlaced = 0;
        
        // Parcourir les jours jusqu'à placer toutes les heures
        for (let dayIndex = 0; dayIndex < days.length && totalPlaced < hoursPerWeek; dayIndex++) {
          const day = days[dayIndex];
          
          // Compter les cours DÉJÀ placés ce jour pour cette matière/classe
          let alreadyPlacedToday = 0;
          timeSlots.forEach(slot => {
            const existingCourse = result.data.byClass[classe.name][day][slot];
            if (existingCourse && existingCourse.subject === subject.name) {
              alreadyPlacedToday++;
            }
          });
          
          // Placer les cours pour ce jour (max maxPerDay)
          for (let slotIndex = 0; slotIndex < timeSlots.length && alreadyPlacedToday < maxPerDay && totalPlaced < hoursPerWeek; slotIndex++) {
            const slot = timeSlots[slotIndex];
            
            // Vérifier si le créneau est libre pour la classe ET l'enseignant
            if (!result.data.byClass[classe.name][day][slot] && 
                !result.data.byTeacher[teacherName][day][slot]) {
              
              const courseInfo = {
                subject: subject.name,
                teacher: teacherName,
                class: classe.name,
                room: `Salle ${(totalPlaced % 3) + 1}`
              };

              // Placer le cours
              result.data.byClass[classe.name][day][slot] = courseInfo;
              result.data.byTeacher[teacherName][day][slot] = {
                subject: subject.name,
                class: classe.name,
                room: courseInfo.room
              };
              
              totalPlaced++;
              alreadyPlacedToday++;
            }
          }
        }
      }
    });

    return result;
  }

  generateByClass(data: any): Observable<any> {
    return this.api.post(`${this.endpoint}/generate/by-class`, data);
  }

  generateByTeacher(data: any): Observable<any> {
    return this.api.post(`${this.endpoint}/generate/by-teacher`, data);
  }

  validate(timetableData: any): Observable<any> {
    return this.api.post(`${this.endpoint}/validate`, { timetableData });
  }

  setLastGeneratedResult(result: any): void {
    this.lastGeneratedResult = result;
  }

  getLastGeneratedSchedules(): Observable<any> {
    return of(this.lastGeneratedResult);
  }
}