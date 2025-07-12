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

    // ALGORITHME SIMPLE : Placer exactement les heures demandées
    const placedCourses = new Map(); // Suivi des cours placés
    
    data.assignments?.forEach((assignment: any) => {
      const teacher = data.teachers?.find((t: any) => t.id === assignment.teacherId);
      const subject = data.subjects?.find((s: any) => s.id === assignment.subjectId);
      const classe = data.classes?.find((c: any) => c.id === assignment.classId);

      if (teacher && subject && classe) {
        const teacherName = `${teacher.firstName} ${teacher.lastName}`;
        const hoursNeeded = assignment.hoursPerWeek || 1;
        const maxPerDay = subject.maxPerDay || 2;
        const key = `${classe.name}-${subject.name}`;
        
        if (!placedCourses.has(key)) {
          placedCourses.set(key, 0);
        }
        
        let hoursPlaced = placedCourses.get(key);
        
        // Placer les heures restantes
        for (let dayIndex = 0; dayIndex < days.length && hoursPlaced < hoursNeeded; dayIndex++) {
          const day = days[dayIndex];
          let dailyPlaced = 0;
          
          // Placer jusqu'à maxPerDay cours ce jour
          for (let slotIndex = 0; slotIndex < timeSlots.length && dailyPlaced < maxPerDay && hoursPlaced < hoursNeeded; slotIndex++) {
            const slot = timeSlots[slotIndex];
            
            // Vérifier si le créneau est libre
            if (!result.data.byClass[classe.name][day][slot] && 
                !result.data.byTeacher[teacherName][day][slot]) {
              
              const courseInfo = {
                subject: subject.name,
                teacher: teacherName,
                class: classe.name,
                room: `Salle ${(hoursPlaced % 4) + 1}`
              };

              result.data.byClass[classe.name][day][slot] = courseInfo;
              result.data.byTeacher[teacherName][day][slot] = {
                ...courseInfo,
                class: classe.name
              };
              
              hoursPlaced++;
              dailyPlaced++;
            }
          }
        }
        
        placedCourses.set(key, hoursPlaced);
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