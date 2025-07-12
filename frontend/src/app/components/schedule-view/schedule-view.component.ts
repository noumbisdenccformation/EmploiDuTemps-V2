import { Component, Input } from '@angular/core';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-schedule-view',
  template: `
    <div *ngIf="result" class="schedule-container">
      
      <!-- Conflits masqués pour cette version -->
      <mat-card *ngIf="false" class="conflicts-card">
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
            <div class="stat success">
              <mat-icon>check_circle</mat-icon>
              <span>0 Conflits</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Bouton PDF Global -->
      <div class="global-actions">
        <button (click)="generateAllPDF()" class="pdf-all-btn">
          📄 Générer tous les PDF
        </button>
      </div>

      <!-- Emplois du temps -->
      <mat-tab-group class="schedule-tabs">
        
        <!-- Par Classe -->
        <mat-tab label="📚 Par Classe" *ngIf="result.data?.byClass">
          <div class="tab-content">
            <div *ngFor="let class of getClasses()" class="schedule-section">
              <div class="section-header">
                <h3>{{class}}</h3>
                <button (click)="generateClassPDF(class)" class="pdf-btn">📄 PDF</button>
              </div>
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
              <div class="section-header">
                <h3>{{teacher}}</h3>
                <button (click)="generateTeacherPDF(teacher)" class="pdf-btn">📄 PDF</button>
              </div>
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
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .pdf-btn {
      background: #4caf50;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .pdf-btn:hover {
      background: #45a049;
    }
    .global-actions {
      text-align: center;
      margin: 20px 0;
    }
    .pdf-all-btn {
      background: #ff9800;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    }
    .pdf-all-btn:hover {
      background: #f57c00;
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

  constructor(private pdfService: PdfService) {}

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

  generateClassPDF(className: string) {
    const schedule = this.convertClassScheduleToPDF(className);
    this.pdfService.generateSchedulePDF(schedule, `Emploi du temps - ${className}`)
      .subscribe(blob => {
        this.pdfService.downloadPDF(blob, `emploi_temps_${className}.pdf`);
      });
  }

  generateTeacherPDF(teacherName: string) {
    const schedule = this.convertTeacherScheduleToPDF(teacherName);
    this.pdfService.generateSchedulePDF(schedule, `Emploi du temps - ${teacherName}`)
      .subscribe(blob => {
        this.pdfService.downloadPDF(blob, `emploi_temps_${teacherName}.pdf`);
      });
  }

  private convertClassScheduleToPDF(className: string): any[] {
    const schedule = [];
    const classData = this.result?.data?.byClass?.[className];
    
    if (classData) {
      for (const day of this.days) {
        for (const timeSlot of this.timeSlots) {
          const course = classData[day]?.[timeSlot];
          if (course) {
            schedule.push({
              day,
              timeSlot,
              subject: course.subject,
              teacher: course.teacher,
              room: course.room || ''
            });
          }
        }
      }
    }
    return schedule;
  }

  private convertTeacherScheduleToPDF(teacherName: string): any[] {
    const schedule = [];
    const teacherData = this.result?.data?.byTeacher?.[teacherName];
    
    if (teacherData) {
      for (const day of this.days) {
        for (const timeSlot of this.timeSlots) {
          const course = teacherData[day]?.[timeSlot];
          if (course) {
            schedule.push({
              day,
              timeSlot,
              subject: course.subject,
              class: course.class,
              room: course.room || ''
            });
          }
        }
      }
    }
    return schedule;
  }

  generateAllPDF() {
    const allSchedules = [];
    
    // Ajouter tous les emplois du temps des classes
    this.getClasses().forEach(className => {
      const schedule = this.convertClassScheduleToPDF(className);
      allSchedules.push({ schedule, title: `Emploi du temps - ${className}` });
    });
    
    // Ajouter tous les emplois du temps des enseignants
    this.getTeachers().forEach(teacherName => {
      const schedule = this.convertTeacherScheduleToPDF(teacherName);
      allSchedules.push({ schedule, title: `Emploi du temps - ${teacherName}` });
    });
    
    this.pdfService.generateAllSchedulesPDF(allSchedules)
      .subscribe(blob => {
        this.pdfService.downloadPDF(blob, 'tous_les_emplois_du_temps.html');
      });
  }
}