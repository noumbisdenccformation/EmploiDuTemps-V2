import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-schedule-view',
  template: `
    <div *ngIf="result" class="schedule-container">
      
      <!-- Conflits -->
      <mat-card *ngIf="result.conflicts?.count > 0" class="conflicts-card">
        <mat-card-header>
          <mat-card-title>⚠️ Conflits Détectés ({{result.conflicts.count}})</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let conflict of result.conflicts.detected" class="conflict-item">
            <strong>{{conflict.subject}} - {{conflict.class}}</strong><br>
            <span>Enseignants disponibles: 
              <mat-chip-list>
                <mat-chip *ngFor="let teacher of conflict.availableTeachers">
                  {{teacher.name}}
                </mat-chip>
              </mat-chip-list>
            </span>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Résumé -->
      <mat-card class="summary-card">
        <mat-card-content>
          <div class="summary-stats">
            <div class="stat">
              <mat-icon>school</mat-icon>
              <span>{{result.summary?.classesCount || 0}} Classes</span>
            </div>
            <div class="stat">
              <mat-icon>people</mat-icon>
              <span>{{result.summary?.teachersCount || 0}} Enseignants</span>
            </div>
            <div class="stat">
              <mat-icon>book</mat-icon>
              <span>{{result.summary?.subjectsProcessed || 0}} Matières</span>
            </div>
            <div class="stat" [class.success]="result.summary?.conflictsDetected === 0" 
                 [class.warning]="result.summary?.conflictsDetected > 0">
              <mat-icon>{{result.summary?.conflictsDetected === 0 ? 'check_circle' : 'warning'}}</mat-icon>
              <span>{{result.summary?.conflictsDetected || 0}} Conflits</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Emplois du temps -->
      <mat-tab-group class="schedule-tabs">
        
        <!-- Par Classe -->
        <mat-tab label="📚 Par Classe" *ngIf="result.data?.byClass">
          <div class="tab-content">
            <div *ngFor="let class of getClasses()" class="schedule-section">
              <h3>{{class}}</h3>
              <div class="schedule-grid">
                <div class="time-header">Heure</div>
                <div *ngFor="let day of days" class="day-header">{{day}}</div>
                
                <ng-container *ngFor="let time of timeSlots">
                  <div class="time-cell">{{time}}</div>
                  <div *ngFor="let day of days" class="course-cell" 
                       [class.has-course]="getCourse(class, day, time)">
                    <div *ngIf="getCourse(class, day, time)" class="course-info">
                      <strong>{{getCourse(class, day, time).subject}}</strong><br>
                      <small>{{getCourse(class, day, time).teacher}}</small>
                    </div>
                  </div>
                </ng-container>
              </div>
            </div>
          </div>
        </mat-tab>
        
        <!-- Par Enseignant -->
        <mat-tab label="👨‍🏫 Par Enseignant" *ngIf="result.data?.byTeacher">
          <div class="tab-content">
            <div *ngFor="let teacher of getTeachers()" class="schedule-section">
              <h3>{{teacher}}</h3>
              <div class="schedule-grid">
                <div class="time-header">Heure</div>
                <div *ngFor="let day of days" class="day-header">{{day}}</div>
                
                <ng-container *ngFor="let time of timeSlots">
                  <div class="time-cell">{{time}}</div>
                  <div *ngFor="let day of days" class="course-cell" 
                       [class.has-course]="getTeacherCourse(teacher, day, time)">
                    <div *ngIf="getTeacherCourse(teacher, day, time)" class="course-info">
                      <strong>{{getTeacherCourse(teacher, day, time).subject}}</strong><br>
                      <small>{{getTeacherCourse(teacher, day, time).class}}</small>
                    </div>
                  </div>
                </ng-container>
              </div>
            </div>
          </div>
        </mat-tab>
        
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .schedule-container { margin: 20px; }
    .conflicts-card { background: #fff3cd; margin-bottom: 20px; }
    .conflict-item { margin: 10px 0; }
    .summary-card { margin-bottom: 20px; }
    .summary-stats { display: flex; gap: 30px; flex-wrap: wrap; }
    .stat { display: flex; align-items: center; gap: 8px; }
    .stat.success { color: #4caf50; }
    .stat.warning { color: #ff9800; }
    .schedule-tabs { margin-top: 20px; }
    .tab-content { padding: 20px; }
    .schedule-section { margin-bottom: 40px; }
    .schedule-grid { 
      display: grid; 
      grid-template-columns: 120px repeat(5, 1fr); 
      gap: 2px; 
      background: #f5f5f5; 
      padding: 10px; 
      border-radius: 8px; 
    }
    .time-header, .day-header { 
      background: #1976d2; 
      color: white; 
      padding: 12px; 
      text-align: center; 
      font-weight: bold; 
    }
    .time-cell { 
      background: #e3f2fd; 
      padding: 12px; 
      text-align: center; 
      font-weight: 500; 
    }
    .course-cell { 
      background: white; 
      padding: 8px; 
      min-height: 60px; 
      border: 1px solid #ddd; 
    }
    .course-cell.has-course { 
      background: #e8f5e8; 
      border-color: #4caf50; 
    }
    .course-info { 
      font-size: 12px; 
      line-height: 1.3; 
    }
    .course-info strong { 
      color: #1976d2; 
    }
    h3 { 
      color: #1976d2; 
      border-bottom: 2px solid #1976d2; 
      padding-bottom: 8px; 
    }
  `]
})
export class ScheduleViewComponent {
  @Input() result: any;
  
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:30-13:30', '13:30-14:30', '14:30-15:30', '15:30-16:30'
  ];

  getClasses(): string[] {
    return this.result?.data?.byClass ? Object.keys(this.result.data.byClass) : [];
  }

  getTeachers(): string[] {
    return this.result?.data?.byTeacher ? Object.keys(this.result.data.byTeacher) : [];
  }

  getCourse(className: string, day: string, time: string): any {
    return this.result?.data?.byClass?.[className]?.[day]?.[time];
  }

  getTeacherCourse(teacherName: string, day: string, time: string): any {
    return this.result?.data?.byTeacher?.[teacherName]?.[day]?.[time];
  }
}