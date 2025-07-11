import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private teachersSubject = new BehaviorSubject<any[]>([
    { id: 1, firstName: 'Jean', lastName: 'Dupont' },
    { id: 2, firstName: 'Marie', lastName: 'Martin' },
    { id: 3, firstName: 'Pierre', lastName: 'Durand' }
  ]);

  private subjectsSubject = new BehaviorSubject<any[]>([
    { id: 1, name: 'Mathématiques', duration: 1 },
    { id: 2, name: 'Français', duration: 1 }
  ]);

  private classesSubject = new BehaviorSubject<any[]>([
    { id: 1, name: '6ème A' },
    { id: 2, name: '6ème B' }
  ]);

  teachers$ = this.teachersSubject.asObservable();
  subjects$ = this.subjectsSubject.asObservable();
  classes$ = this.classesSubject.asObservable();

  // Teachers
  getTeachers() { return this.teachersSubject.value; }
  addTeacher(teacher: any) {
    const current = this.teachersSubject.value;
    const id = Math.max(...current.map(t => t.id), 0) + 1;
    this.teachersSubject.next([...current, { ...teacher, id }]);
  }
  removeTeacher(id: number) {
    const current = this.teachersSubject.value;
    this.teachersSubject.next(current.filter(t => t.id !== id));
  }

  // Subjects
  getSubjects() { return this.subjectsSubject.value; }
  addSubject(subject: any) {
    const current = this.subjectsSubject.value;
    const id = Math.max(...current.map(s => s.id), 0) + 1;
    this.subjectsSubject.next([...current, { ...subject, id }]);
  }
  removeSubject(id: number) {
    const current = this.subjectsSubject.value;
    this.subjectsSubject.next(current.filter(s => s.id !== id));
  }

  // Classes
  getClasses() { return this.classesSubject.value; }
  addClass(classe: any) {
    const current = this.classesSubject.value;
    const id = Math.max(...current.map(c => c.id), 0) + 1;
    this.classesSubject.next([...current, { ...classe, id }]);
  }
  removeClass(id: number) {
    const current = this.classesSubject.value;
    this.classesSubject.next(current.filter(c => c.id !== id));
  }

  // Helper methods
  getTeacherName(id: number): string {
    const teacher = this.getTeachers().find(t => t.id == id);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : `Enseignant ${id}`;
  }

  getSubjectName(id: number): string {
    const subject = this.getSubjects().find(s => s.id == id);
    return subject ? subject.name : `Matière ${id}`;
  }

  getClassName(id: number): string {
    const classe = this.getClasses().find(c => c.id == id);
    return classe ? classe.name : `Classe ${id}`;
  }
}