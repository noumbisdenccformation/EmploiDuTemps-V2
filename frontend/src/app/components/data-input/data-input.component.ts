import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AssignmentService } from '../../services/assignment.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-data-input',
  template: `
    <mat-card class="input-card">
      <mat-card-header>
        <mat-card-title>Génération d'Emploi du Temps</mat-card-title>
        <mat-card-subtitle>Utilisez la page "Affectations" pour configurer enseignants, matières et classes</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="info-section">
          <h3>📊 Résumé des données</h3>
          <div class="summary">
            <div class="summary-item">
              <strong>{{teacherCount}}</strong> Enseignants
            </div>
            <div class="summary-item">
              <strong>{{subjectCount}}</strong> Matières
            </div>
            <div class="summary-item">
              <strong>{{classCount}}</strong> Classes
            </div>
            <div class="summary-item">
              <strong>{{assignmentCount}}</strong> Affectations
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button mat-raised-button color="primary" (click)="generateData()" [disabled]="assignmentCount === 0">
            <mat-icon>schedule</mat-icon>
            Générer Emploi du Temps
          </button>
          <button mat-raised-button color="accent" (click)="refreshData()">
            <mat-icon>sync</mat-icon>
            Actualiser les Données
          </button>
        </div>
        
        <div class="help-text" *ngIf="assignmentCount === 0">
          <mat-icon>info</mat-icon>
          <span>Veuillez d'abord créer des affectations dans la page "Affectations"</span>
        </div>
        
        <div class="debug-info" style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px;">
          <h4>Debug Info:</h4>
          <p>Assignments count: {{assignmentCount}}</p>
          <p>Teachers count: {{teacherCount}}</p>
          <p>Subjects count: {{subjectCount}}</p>
          <p>Classes count: {{classCount}}</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .input-card { margin: 20px; }
    .info-section { margin: 20px 0; }
    .summary { display: flex; gap: 20px; flex-wrap: wrap; }
    .summary-item { 
      background: #f5f5f5; 
      padding: 15px; 
      border-radius: 8px; 
      text-align: center;
      min-width: 120px;
    }
    .actions { margin-top: 30px; }
    .actions button { margin-right: 10px; }
    .help-text { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      margin-top: 20px; 
      color: #666;
    }
    h3 { color: #1976d2; }
  `]
})
export class DataInputComponent implements OnInit {
  @Output() dataGenerated = new EventEmitter<any>();
  
  teacherCount = 0;
  subjectCount = 0;
  classCount = 0;
  assignmentCount = 0;

  constructor(
    private assignmentService: AssignmentService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.refreshData();
    // Auto-génération si des affectations existent
    setTimeout(() => {
      if (this.assignmentCount > 0) {
        console.log('Auto-génération avec', this.assignmentCount, 'affectations');
        this.generateData();
      }
    }, 1000);
  }

  refreshData() {
    try {
      const assignments = this.assignmentService.getAssignments();
      this.assignmentCount = assignments.length;
      
      // Compter les enseignants uniques
      const teacherIds = [...new Set(assignments.map(a => a.teacherId))];
      this.teacherCount = teacherIds.length;
      
      // Compter les matières uniques
      const subjectIds = [...new Set(assignments.map(a => a.subjectId))];
      this.subjectCount = subjectIds.length;
      
      // Compter les classes uniques
      const classIds = [...new Set(assignments.map(a => a.classId))];
      this.classCount = classIds.length;
      
      console.log('Données actualisées:', {
        teachers: this.teacherCount,
        subjects: this.subjectCount,
        classes: this.classCount,
        assignments: this.assignmentCount
      });
    } catch (error) {
      console.error('Erreur lors de l\'actualisation:', error);
    }
  }

  generateData() {
    try {
      const assignments = this.assignmentService.getAssignments();
      
      if (assignments.length === 0) {
        console.warn('Aucune affectation définie');
        alert('Aucune affectation définie. Veuillez créer des affectations dans la page "Affectations".');
        return;
      }
      
      console.log('Affectations trouvées:', assignments);
      
      const data = {
        teachers: this.getTeachersFromAssignments(assignments),
        subjects: this.getSubjectsFromAssignments(assignments),
        classes: this.getClassesFromAssignments(assignments),
        rooms: [
          { id: 1, name: 'Salle A1', type: 'classroom', status: 'unique', capacity: 30 },
          { id: 2, name: 'Salle A2', type: 'classroom', status: 'unique', capacity: 30 },
          { id: 3, name: 'Labo Chimie', type: 'laboratory', status: 'commune', capacity: 20 },
          { id: 4, name: 'Amphi 1', type: 'amphitheater', status: 'commune', capacity: 100 }
        ],
        assignments: assignments
      };

      console.log('Génération avec', assignments.length, 'affectations');
      console.log('Données à envoyer:', data);
      this.dataGenerated.emit(data);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert('Erreur lors de la génération de l\'emploi du temps');
    }
  }

  getTeachersFromAssignments(assignments: any[]) {
    return this.dataService.getTeachers().map(teacher => ({
      ...teacher,
      subjects: assignments
        .filter(a => a.teacherId === teacher.id)
        .map(a => ({ id: a.subjectId }))
    }));
  }

  getSubjectsFromAssignments(assignments: any[]) {
    return this.dataService.getSubjects();
  }

  getClassesFromAssignments(assignments: any[]) {
    return this.dataService.getClasses().map(classe => ({
      ...classe,
      subjects: assignments
        .filter(a => a.classId === classe.id)
        .map(a => ({ id: a.subjectId }))
    }));
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
}