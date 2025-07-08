import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1>Tableau de Bord</h1>
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon>people</mat-icon>
            <mat-card-title>Enseignants</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{teacherCount}}</h2>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon>book</mat-icon>
            <mat-card-title>Matières</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{subjectCount}}</h2>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon>school</mat-icon>
            <mat-card-title>Classes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{classCount}}</h2>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 20px; }
    .stats-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 20px; 
      margin-top: 20px; 
    }
    .stat-card { text-align: center; }
    .stat-card h2 { font-size: 2em; color: #1976d2; margin: 0; }
    mat-card-header { justify-content: center; }
  `]
})
export class DashboardComponent {
  teacherCount = 0;
  subjectCount = 0;
  classCount = 0;
}