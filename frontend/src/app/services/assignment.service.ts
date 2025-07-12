import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private assignmentsSubject = new BehaviorSubject<any[]>([
    { teacherId: 1, subjectId: 1, classId: 1, hoursPerWeek: 2 },
    { teacherId: 2, subjectId: 2, classId: 1, hoursPerWeek: 1 },
    { teacherId: 3, subjectId: 2, classId: 2, hoursPerWeek: 1 }
  ]);

  assignments$ = this.assignmentsSubject.asObservable();

  getAssignments() {
    return this.assignmentsSubject.value;
  }

  getTeacherAvailability(teacherId: number) {
    // Cette méthode sera appelée depuis data-input
    // Pour l'instant, retourner un objet vide
    return {};
  }

  addAssignment(assignment: any) {
    const current = this.assignmentsSubject.value;
    this.assignmentsSubject.next([...current, assignment]);
  }

  removeAssignment(assignment: any) {
    const current = this.assignmentsSubject.value;
    const filtered = current.filter(a => 
      !(a.teacherId === assignment.teacherId && 
        a.subjectId === assignment.subjectId && 
        a.classId === assignment.classId)
    );
    this.assignmentsSubject.next(filtered);
  }
}