import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AssignmentService } from '../../services/assignment.service';
import { DataService } from '../../services/data.service';
import { TranslationService } from '../../services/translation.service';

// Interfaces
export interface Subject {
  id: number;
  name: string;
  code: string;
  duration: number;
}

export interface Class {
  id?: number;
  name: string;
  level: string;
  studentCount?: number;
  maxHoursPerDay?: number;  // Nouveau champ
  maxHoursPerWeek?: number; // Nouveau champ
  subjects?: Subject[];
}

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subjects?: Subject[];
}

export interface Assignment {
  id: number;
  teacherId: number;
  subjectId: number;
  classId: number;
  hoursPerWeek: number;
}

@Component({
  selector: 'app-data-input',
  template: `
    <mat-card class="input-card">
      <mat-card-header>
        <mat-card-title>{{translate('timetable.title')}}</mat-card-title>
        <mat-card-subtitle>{{translate('timetable.subtitle')}}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="info-section">
          <h3>📊 {{translate('timetable.summary')}}</h3>
          <div class="summary">
            <div class="summary-item">
              <strong>{{teacherCount}}</strong> {{translate('timetable.teachers')}}
            </div>
            <div class="summary-item">
              <strong>{{subjectCount}}</strong> {{translate('timetable.subjects')}}
            </div>
            <div class="summary-item">
              <strong>{{classCount}}</strong> {{translate('timetable.classes')}}
            </div>
            <div class="summary-item">
              <strong>{{assignmentCount}}</strong> {{translate('timetable.assignments')}}
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button mat-raised-button color="primary" (click)="generateData()" [disabled]="assignmentCount === 0">
            <mat-icon>schedule</mat-icon>
            {{translate('timetable.generate')}}
          </button>
          <button mat-raised-button color="accent" (click)="refreshData()">
            <mat-icon>sync</mat-icon>
            {{translate('common.refresh')}}
          </button>
        </div>
        
        <div class="help-text" *ngIf="assignmentCount === 0">
          <mat-icon>info</mat-icon>
          <span>{{translate('timetable.create_assignments_first')}}</span>
        </div>
        
        <div class="debug-info" style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px;">
          <h4>{{translate('timetable.debug_info')}}</h4>
          <p>{{translate('timetable.assignments_count')}} {{assignmentCount}}</p>
          <p>{{translate('timetable.teachers_count')}} {{teacherCount}}</p>
          <p>{{translate('timetable.subjects_count')}} {{subjectCount}}</p>
          <p>{{translate('timetable.classes_count')}} {{classCount}}</p>
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

  // Propriétés pour la gestion des classes (pour les futures fonctionnalités)
  classes: Class[] = [];
  newClassName = '';
  newClassLevel = '';
  newClassStudentCount = 0;

  // Valeurs par défaut pour les limites d'heures
  defaultLimits = {
    maxHoursPerDay: 4,
    maxHoursPerWeek: 15
  };

  constructor(
    private assignmentService: AssignmentService,
    private dataService: DataService,
    private translationService: TranslationService
  ) {}

  translate(key: string): string {
    return this.translationService.translate(key);
  }

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
      // Ajouter les limites d'heures par défaut si elles ne sont pas définies
      maxHoursPerDay: classe.maxHoursPerDay || this.defaultLimits.maxHoursPerDay,
      maxHoursPerWeek: classe.maxHoursPerWeek || this.defaultLimits.maxHoursPerWeek,
      subjects: assignments
        .filter(a => a.classId === classe.id)
        .map(a => ({ id: a.subjectId }))
    }));
  }

  getTeacherName(id: number): string {
    const teacher = this.dataService.getTeachers().find(t => t.id === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : `Enseignant ${id}`;
  }

  getSubjectName(id: number): string {
    const subject = this.dataService.getSubjects().find(s => s.id === id);
    return subject ? subject.name : `Matière ${id}`;
  }

  getClassName(id: number): string {
    const classe = this.dataService.getClasses().find(c => c.id === id);
    return classe ? classe.name : `Classe ${id}`;
  }

  // Méthodes pour la gestion des classes (pour les futures fonctionnalités)
  addClass() {
    const newClass: Class = {
      name: this.newClassName,
      level: this.newClassLevel,
      studentCount: this.newClassStudentCount || 0,
      maxHoursPerDay: this.defaultLimits.maxHoursPerDay,
      maxHoursPerWeek: this.defaultLimits.maxHoursPerWeek,
      subjects: []
    };

    this.classes.push(newClass);
    this.newClassName = '';
    this.newClassLevel = '';
    this.newClassStudentCount = 0;
  }

  // Méthode pour mettre à jour les limites d'une classe
  updateClassLimits(classIndex: number, field: 'maxHoursPerDay' | 'maxHoursPerWeek', value: number) {
    if (this.classes[classIndex]) {
      this.classes[classIndex][field] = value;
    }
  }

  // Méthode pour réinitialiser les limites d'une classe
  resetClassLimits(classIndex: number) {
    if (this.classes[classIndex]) {
      this.classes[classIndex].maxHoursPerDay = this.defaultLimits.maxHoursPerDay;
      this.classes[classIndex].maxHoursPerWeek = this.defaultLimits.maxHoursPerWeek;
    }
  }
}