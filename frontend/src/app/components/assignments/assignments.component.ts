import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../../services/assignment.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-assignments',
  template: `
    <div class="assignments-container">
      <h2>Gestion Complète des Affectations</h2>
      
      <!-- Gestion des Enseignants -->
      <mat-card class="section-card">
        <mat-card-header>
          <mat-card-title>👨‍🏫 Enseignants</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="add-form">
            <input [(ngModel)]="newTeacher.firstName" placeholder="Prénom">
            <input [(ngModel)]="newTeacher.lastName" placeholder="Nom">
            <button (click)="addTeacher()">Ajouter Enseignant</button>
          </div>
          <div class="items-list">
            <div class="teacher-card" *ngFor="let teacher of teachers">
              <div class="teacher-info">
                <strong>{{teacher.firstName}} {{teacher.lastName}}</strong>
                <button (click)="removeTeacher(teacher.id)" class="delete">×</button>
              </div>
              
              <!-- Disponibilités -->
              <div class="availability-section">
                <h4>📅 Disponibilités</h4>
                
                <!-- Option toute la semaine -->
                <div class="week-availability">
                  <label>
                    <input type="checkbox" [checked]="isTeacherAvailableAllWeek(teacher.id)" 
                           (change)="toggleTeacherAllWeek(teacher.id, $any($event.target).checked)">
                    <strong>Toute la semaine</strong>
                  </label>
                </div>
                
                <div *ngFor="let day of days" class="day-availability">
                  <label>
                    <input type="checkbox" [checked]="isTeacherAvailable(teacher.id, day)" 
                           (change)="toggleTeacherDay(teacher.id, day, $any($event.target).checked)">
                    {{day}}
                  </label>
                  <div *ngIf="isTeacherAvailable(teacher.id, day)" class="time-slots">
                    <div *ngFor="let slot of getTeacherTimeSlots(teacher.id, day); let i = index" class="time-slot">
                      <input type="time" [value]="slot.start" 
                             (change)="updateTeacherSlot(teacher.id, day, i, 'start', $any($event.target).value)"
                             placeholder="Début">
                      <span> à </span>
                      <input type="time" [value]="slot.end" 
                             (change)="updateTeacherSlot(teacher.id, day, i, 'end', $any($event.target).value)"
                             placeholder="Fin">
                      <button (click)="removeTeacherSlot(teacher.id, day, i)" 
                              *ngIf="getTeacherTimeSlots(teacher.id, day).length > 1" 
                              class="remove-slot">-</button>
                    </div>
                    <button (click)="addTeacherSlot(teacher.id, day)" class="add-slot">+ Ajouter créneau</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Gestion des Matières -->
      <mat-card class="section-card">
        <mat-card-header>
          <mat-card-title>📚 Matières</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="add-form">
            <input [(ngModel)]="newSubject.name" placeholder="Nom de la matière">
            <input [(ngModel)]="newSubject.duration" type="number" placeholder="Durée (h)" step="1" min="1">
            <input [(ngModel)]="newSubject.maxPerDay" type="number" placeholder="Max par jour" step="1" min="1" max="8">
            <button (click)="addSubject()">Ajouter Matière</button>
          </div>
          <div class="items-list">
            <div class="item-card" *ngFor="let subject of subjects">
              {{subject.name}} ({{subject.duration}}h/sem, max {{subject.maxPerDay || 2}}/jour)
              <button (click)="removeSubject(subject.id)" class="delete">×</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Gestion des Classes -->
      <mat-card class="section-card">
        <mat-card-header>
          <mat-card-title>🏫 Classes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="add-form">
            <input [(ngModel)]="newClass.name" placeholder="Nom de la classe">
            <button (click)="addClass()">Ajouter Classe</button>
          </div>
          <div class="items-list">
            <div class="item-card" *ngFor="let class of classes">
              {{class.name}}
              <button (click)="removeClass(class.id)" class="delete">×</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Affectations -->
      <mat-card class="section-card">
        <mat-card-header>
          <mat-card-title>📅 Affectations</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="add-form">
            <select [(ngModel)]="newAssignment.teacherId">
              <option value="">Sélectionner un enseignant</option>
              <option *ngFor="let teacher of teachers" [value]="teacher.id">
                {{teacher.firstName}} {{teacher.lastName}}
              </option>
            </select>
            <select [(ngModel)]="newAssignment.subjectId">
              <option value="">Sélectionner une matière</option>
              <option *ngFor="let subject of subjects" [value]="subject.id">
                {{subject.name}}
              </option>
            </select>
            <select [(ngModel)]="newAssignment.classId">
              <option value="">Sélectionner une classe</option>
              <option *ngFor="let class of classes" [value]="class.id">
                {{class.name}}
              </option>
            </select>
            <input [(ngModel)]="newAssignment.hoursPerWeek" type="number" placeholder="Heures/semaine" step="1" min="1">
            <button (click)="addAssignment()">Créer Affectation</button>
          </div>
          <div class="items-list">
            <div class="assignment-card" *ngFor="let assignment of assignments">
              <strong>{{getTeacherName(assignment.teacherId)}}</strong> 
              enseigne <strong>{{getSubjectName(assignment.subjectId)}}</strong> 
              à <strong>{{getClassName(assignment.classId)}}</strong>
              ({{assignment.hoursPerWeek}}h/semaine)
              <button (click)="removeAssignment(assignment)" class="delete">×</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .assignments-container { padding: 20px; }
    .section-card { margin: 20px 0; }
    .add-form { 
      display: flex; 
      gap: 10px; 
      margin-bottom: 15px;
      flex-wrap: wrap;
    }
    .add-form input, .add-form select { 
      padding: 8px; 
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .add-form button {
      background: #2196f3;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .items-list { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 10px;
    }
    .item-card, .assignment-card { 
      border: 1px solid #ddd; 
      padding: 10px; 
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f9f9f9;
    }
    .teacher-card {
      border: 1px solid #ddd;
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
      background: #f9f9f9;
    }
    .teacher-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .availability-section {
      background: #f0f8ff;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
    }
    .day-availability {
      margin: 8px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .time-slots {
      margin-left: 20px;
      margin-top: 8px;
    }
    .time-slot {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 5px 0;
    }
    .time-slot input {
      padding: 4px;
      border: 1px solid #ddd;
      border-radius: 3px;
    }
    .add-slot, .remove-slot {
      background: #2196f3;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    }
    .remove-slot {
      background: #f44336;
    }
    .add-slot {
      margin-top: 8px;
      display: block;
    }
    .week-availability {
      background: #e3f2fd;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      border-left: 4px solid #2196f3;
    }
    .week-availability label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .assignment-card {
      width: 100%;
      margin: 5px 0;
    }
    .delete { 
      background: #e74c3c; 
      color: white; 
      border: none; 
      padding: 4px 8px; 
      border-radius: 3px;
      cursor: pointer;
      margin-left: 10px;
    }
  `]
})
export class AssignmentsComponent implements OnInit {
  assignments: any[] = [];
  teachers: any[] = [];
  subjects: any[] = [];
  classes: any[] = [];
  
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  teacherAvailability: any = {};
  
  newTeacher = { firstName: '', lastName: '' };
  newSubject = { name: '', duration: 10, maxPerDay: 1 };
  newClass = { name: '' };
  newAssignment = { teacherId: '', subjectId: '', classId: '', hoursPerWeek: 1 };

  constructor(
    private assignmentService: AssignmentService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.assignmentService.assignments$.subscribe(assignments => {
      this.assignments = assignments;
    });
    
    this.dataService.teachers$.subscribe(teachers => {
      this.teachers = teachers;
    });
    
    this.dataService.subjects$.subscribe(subjects => {
      this.subjects = subjects;
    });
    
    this.dataService.classes$.subscribe(classes => {
      this.classes = classes;
    });
  }

  addAssignment() {
    if (this.newAssignment.teacherId && this.newAssignment.subjectId && this.newAssignment.classId) {
      this.assignmentService.addAssignment({
        teacherId: parseInt(this.newAssignment.teacherId),
        subjectId: parseInt(this.newAssignment.subjectId),
        classId: parseInt(this.newAssignment.classId),
        hoursPerWeek: this.newAssignment.hoursPerWeek
      });
      this.newAssignment = { teacherId: '', subjectId: '', classId: '', hoursPerWeek: 1 };
    }
  }

  removeAssignment(assignment: any) {
    this.assignmentService.removeAssignment(assignment);
  }

  // Gestion des enseignants
  addTeacher() {
    if (this.newTeacher.firstName && this.newTeacher.lastName) {
      this.dataService.addTeacher(this.newTeacher);
      this.newTeacher = { firstName: '', lastName: '' };
    }
  }

  removeTeacher(id: number) {
    this.dataService.removeTeacher(id);
    // Supprimer les affectations liées
    this.assignments.filter(a => a.teacherId === id).forEach(a => {
      this.assignmentService.removeAssignment(a);
    });
  }

  // Gestion des matières
  addSubject() {
    if (this.newSubject.name) {
      this.dataService.addSubject(this.newSubject);
      this.newSubject = { name: '', duration: 10, maxPerDay: 1 };
    }
  }

  removeSubject(id: number) {
    this.dataService.removeSubject(id);
    // Supprimer les affectations liées
    this.assignments.filter(a => a.subjectId === id).forEach(a => {
      this.assignmentService.removeAssignment(a);
    });
  }

  // Gestion des classes
  addClass() {
    if (this.newClass.name) {
      this.dataService.addClass(this.newClass);
      this.newClass = { name: '' };
    }
  }

  removeClass(id: number) {
    this.dataService.removeClass(id);
    // Supprimer les affectations liées
    this.assignments.filter(a => a.classId === id).forEach(a => {
      this.assignmentService.removeAssignment(a);
    });
  }

  getTeacherName(id: number): string {
    return this.dataService.getTeacherName(id);
  }

  getSubjectName(id: number): string {
    return this.dataService.getSubjectName(id);
  }

  getClassName(id: number): string {
    return this.dataService.getClassName(id);
  }

  // Gestion des disponibilités
  isTeacherAvailable(teacherId: number, day: string): boolean {
    return this.teacherAvailability[teacherId]?.[day] !== undefined;
  }

  toggleTeacherDay(teacherId: number, day: string, checked: boolean) {
    if (!this.teacherAvailability[teacherId]) {
      this.teacherAvailability[teacherId] = {};
    }
    
    if (checked) {
      this.teacherAvailability[teacherId][day] = [{ start: '08:00', end: '12:00' }];
    } else {
      delete this.teacherAvailability[teacherId][day];
    }
  }

  getTeacherTimeSlots(teacherId: number, day: string): any[] {
    return this.teacherAvailability[teacherId]?.[day] || [];
  }

  updateTeacherSlot(teacherId: number, day: string, slotIndex: number, type: string, value: string) {
    if (this.teacherAvailability[teacherId]?.[day]?.[slotIndex]) {
      this.teacherAvailability[teacherId][day][slotIndex][type] = value;
    }
  }

  // Gestion "toute la semaine"
  isTeacherAvailableAllWeek(teacherId: number): boolean {
    if (!this.teacherAvailability[teacherId]) return false;
    return this.days.every(day => 
      this.teacherAvailability[teacherId][day] && 
      this.teacherAvailability[teacherId][day].length > 0
    );
  }

  toggleTeacherAllWeek(teacherId: number, checked: boolean) {
    if (!this.teacherAvailability[teacherId]) {
      this.teacherAvailability[teacherId] = {};
    }
    
    if (checked) {
      // Activer tous les jours avec horaires par défaut
      this.days.forEach(day => {
        this.teacherAvailability[teacherId][day] = [{ start: '08:00', end: '17:00' }];
      });
    } else {
      // Désactiver tous les jours
      this.days.forEach(day => {
        delete this.teacherAvailability[teacherId][day];
      });
    }
  }

  addTeacherSlot(teacherId: number, day: string) {
    if (!this.teacherAvailability[teacherId]) {
      this.teacherAvailability[teacherId] = {};
    }
    if (!this.teacherAvailability[teacherId][day]) {
      this.teacherAvailability[teacherId][day] = [];
    }
    this.teacherAvailability[teacherId][day].push({ start: '14:00', end: '16:00' });
  }

  removeTeacherSlot(teacherId: number, day: string, slotIndex: number) {
    if (this.teacherAvailability[teacherId]?.[day]) {
      this.teacherAvailability[teacherId][day].splice(slotIndex, 1);
    }
  }
}