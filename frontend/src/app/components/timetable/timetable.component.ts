import { Component, OnInit } from '@angular/core';
import { TimetableService } from '../../services/timetable.service';

@Component({
  selector: 'app-timetable',
  template: `
    <div class="timetable-container">
      <h1>Génération d'Emploi du Temps</h1>
      
      <app-data-input (dataGenerated)="onDataGenerated($event)"></app-data-input>
      
      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
        <p>Génération en cours...</p>
      </div>

      <app-schedule-view [result]="result"></app-schedule-view>
    </div>
  `,
  styles: [`
    .timetable-container { padding: 20px; }
    .loading { text-align: center; padding: 40px; }
    .loading mat-spinner { margin: 0 auto 20px; }
  `]
})
export class TimetableComponent implements OnInit {
  currentData: any = null;
  result: any = null;
  loading = false;
  


  constructor(private timetableService: TimetableService) {}

  ngOnInit() {}

  onDataGenerated(data: any) {
    this.currentData = data;
    this.generateTimetable();
  }

  generateTimetable() {
    if (!this.currentData) return;
    
    this.loading = true;
    this.timetableService.generate(this.currentData).subscribe({
      next: (result) => {
        this.result = result;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.loading = false;
      }
    });
  }




}