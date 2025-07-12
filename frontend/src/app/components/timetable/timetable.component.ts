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

  ngOnInit() {
    // Essayer de générer automatiquement avec des données par défaut
    setTimeout(() => {
      console.log('Tentative de génération automatique...');
      this.tryAutoGenerate();
    }, 2000);
  }

  tryAutoGenerate() {
    // Données par défaut pour test
    const defaultData = {
      teachers: [
        { id: 1, firstName: 'Jean', lastName: 'Dupont', subjects: [{ id: 1 }] },
        { id: 2, firstName: 'Marie', lastName: 'Martin', subjects: [{ id: 2 }] },
        { id: 3, firstName: 'Pierre', lastName: 'Durand', subjects: [{ id: 2 }] }
      ],
      subjects: [
        { id: 1, name: 'Mathématiques', duration: 1 },
        { id: 2, name: 'Français', duration: 1 }
      ],
      classes: [
        { id: 1, name: '6ème A', subjects: [{ id: 1 }, { id: 2 }] },
        { id: 2, name: '6ème B', subjects: [{ id: 1 }, { id: 2 }] }
      ],
      rooms: [
        { id: 1, name: 'Salle A1', type: 'classroom', status: 'unique', capacity: 30 },
        { id: 2, name: 'Salle A2', type: 'classroom', status: 'unique', capacity: 30 }
      ],
      assignments: [
        { teacherId: 1, subjectId: 1, classId: 1, hoursPerWeek: 2 },
        { teacherId: 2, subjectId: 2, classId: 1, hoursPerWeek: 1 },
        { teacherId: 3, subjectId: 2, classId: 2, hoursPerWeek: 1 },
        { teacherId: 1, subjectId: 1, classId: 2, hoursPerWeek: 2 }
      ]
    };
    
    console.log('Génération avec données par défaut:', defaultData);
    this.onDataGenerated(defaultData);
  }

  onDataGenerated(data: any) {
    console.log('Données reçues dans timetable:', data);
    if (!data || !data.assignments || data.assignments.length === 0) {
      console.warn('Données invalides ou pas d\'affectations');
      return;
    }
    this.currentData = data;
    this.generateTimetable();
  }

  generateTimetable() {
    if (!this.currentData) {
      console.error('Pas de données à générer');
      return;
    }
    
    console.log('Début génération avec:', this.currentData);
    this.loading = true;
    
    this.timetableService.generate(this.currentData).subscribe({
      next: (result) => {
        console.log('Résultat reçu du backend:', result);
        this.result = result;
        this.timetableService.setLastGeneratedResult(result);
        this.loading = false;
        
        if (!result || !result.data) {
          console.error('Résultat vide ou invalide');
        }
      },
      error: (error) => {
        console.error('Erreur génération:', error);
        alert('Erreur lors de la génération: ' + error.message);
        this.loading = false;
      }
    });
  }




}