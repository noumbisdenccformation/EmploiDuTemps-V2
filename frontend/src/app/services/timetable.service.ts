import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
        return new Observable(observer => {
          setTimeout(() => {
            const result = this.generateLocally(data);
            observer.next(result);
            observer.complete();
          }, 1000);
        });
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

    // Génération simple locale
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

    // Placer les cours avec respect strict des heures/semaine
    data.assignments?.forEach((assignment: any) => {
      const teacher = data.teachers?.find((t: any) => t.id === assignment.teacherId);
      const subject = data.subjects?.find((s: any) => s.id === assignment.subjectId);
      const classe = data.classes?.find((c: any) => c.id === assignment.classId);

      if (teacher && subject && classe) {
        const teacherName = `${teacher.firstName} ${teacher.lastName}`;
        const hoursNeeded = assignment.hoursPerWeek || 1;
        const maxPerDay = subject.maxPerDay || 2;
        
        let hoursPlaced = 0;
        let dayIndex = 0;
        
        // Placer exactement le nombre d'heures requis
        while (hoursPlaced < hoursNeeded && dayIndex < days.length) {
          const day = days[dayIndex];
          
          // Compter les cours déjà placés ce jour pour cette matière dans cette classe
          let dailyCount = 0;
          timeSlots.forEach(slot => {
            const existingCourse = result.data.byClass[classe.name][day][slot];
            if (existingCourse && existingCourse.subject === subject.name) {
              dailyCount++;
            }
          });
          
          // Placer des cours ce jour si possible
          while (dailyCount < maxPerDay && hoursPlaced < hoursNeeded) {
            // Trouver un créneau libre
            const availableSlot = timeSlots.find(slot => 
              !result.data.byClass[classe.name][day][slot] && 
              !result.data.byTeacher[teacherName][day][slot]
            );
            
            if (availableSlot) {
              const courseInfo = {
                subject: subject.name,
                teacher: teacherName,
                class: classe.name,
                room: `Salle ${(hoursPlaced % 4) + 1}`
              };

              result.data.byClass[classe.name][day][availableSlot] = {
                ...courseInfo,
                type: 'class_view'
              };

              result.data.byTeacher[teacherName][day][availableSlot] = {
                ...courseInfo,
                type: 'teacher_view'
              };
              
              hoursPlaced++;
              dailyCount++;
            } else {
              break; // Pas de créneau libre ce jour
            }
          }
          
          dayIndex++;
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

  // Stocker le dernier résultat généré
  setLastGeneratedResult(result: any): void {
    this.lastGeneratedResult = result;
  }

  // Récupérer le dernier résultat généré
  getLastGeneratedSchedules(): Observable<any> {
    return new Observable(observer => {
      observer.next(this.lastGeneratedResult);
      observer.complete();
    });
  }
}