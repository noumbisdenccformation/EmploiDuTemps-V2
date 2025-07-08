import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-input',
  template: `
    <mat-card class="input-card">
      <mat-card-header>
        <mat-card-title>Configuration Rapide</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="dataForm">
          
          <!-- Enseignants -->
          <h3>👨‍🏫 Enseignants</h3>
          <div formArrayName="teachers">
            <div *ngFor="let teacher of teachers.controls; let i = index" [formGroupName]="i" class="item-form">
              <div class="form-row">
                <mat-form-field>
                  <mat-label>Prénom</mat-label>
                  <input matInput formControlName="firstName">
                </mat-form-field>
                <mat-form-field>
                  <mat-label>Nom</mat-label>
                  <input matInput formControlName="lastName">
                </mat-form-field>
                <mat-form-field>
                  <mat-label>Matières (1,2,3)</mat-label>
                  <input matInput formControlName="subjectIds">
                </mat-form-field>
                <button mat-icon-button color="warn" (click)="removeTeacher(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
              
              <div class="availability-section">
                <h4>📅 Disponibilités</h4>
                <div *ngFor="let day of days" class="day-availability">
                  <mat-checkbox [checked]="isAvailable(i, day)" (change)="toggleDay(i, day, $event.checked)">
                    {{day}}
                  </mat-checkbox>
                  <div *ngIf="isAvailable(i, day)" class="time-slots">
                    <div *ngFor="let slot of getTimeSlots(i, day); let j = index" class="time-slot">
                      <mat-form-field>
                        <mat-label>Début</mat-label>
                        <input matInput type="time" [value]="slot.start" (change)="updateTimeSlot(i, day, j, 'start', $event.target.value)">
                      </mat-form-field>
                      <mat-form-field>
                        <mat-label>Fin</mat-label>
                        <input matInput type="time" [value]="slot.end" (change)="updateTimeSlot(i, day, j, 'end', $event.target.value)">
                      </mat-form-field>
                      <button mat-icon-button color="warn" (click)="removeTimeSlot(i, day, j)" *ngIf="getTimeSlots(i, day).length > 1">
                        <mat-icon>remove</mat-icon>
                      </button>
                    </div>
                    <button mat-button (click)="addTimeSlot(i, day)" class="add-slot-btn">
                      <mat-icon>add</mat-icon> Ajouter créneau
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button mat-button color="primary" (click)="addTeacher()">
            <mat-icon>add</mat-icon> Ajouter Enseignant
          </button>

          <!-- Matières -->
          <h3>📚 Matières</h3>
          <div formArrayName="subjects">
            <div *ngFor="let subject of subjects.controls; let i = index" [formGroupName]="i" class="item-form">
              <div class="form-row">
                <mat-form-field>
                  <mat-label>Nom</mat-label>
                  <input matInput formControlName="name">
                </mat-form-field>
                <mat-form-field>
                  <mat-label>Durée (min)</mat-label>
                  <input matInput type="number" formControlName="duration">
                </mat-form-field>
                <button mat-icon-button color="warn" (click)="removeSubject(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
          <button mat-button color="primary" (click)="addSubject()">
            <mat-icon>add</mat-icon> Ajouter Matière
          </button>

          <!-- Classes -->
          <h3>🏫 Classes</h3>
          <div formArrayName="classes">
            <div *ngFor="let class of classes.controls; let i = index" [formGroupName]="i" class="item-form">
              <div class="form-row">
                <mat-form-field>
                  <mat-label>Nom</mat-label>
                  <input matInput formControlName="name">
                </mat-form-field>
                <mat-form-field>
                  <mat-label>Matières (1,2,3)</mat-label>
                  <input matInput formControlName="subjectIds">
                </mat-form-field>
                <button mat-icon-button color="warn" (click)="removeClass(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
          <button mat-button color="primary" (click)="addClass()">
            <mat-icon>add</mat-icon> Ajouter Classe
          </button>

        </form>
        
        <div class="actions">
          <button mat-raised-button color="primary" (click)="generateData()">
            <mat-icon>schedule</mat-icon>
            Générer Emploi du Temps
          </button>
          <button mat-button (click)="loadExample()">
            <mat-icon>refresh</mat-icon>
            Exemple
          </button>
          <button mat-raised-button color="accent" (click)="debugData()">
            <mat-icon>bug_report</mat-icon>
            Debug
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .input-card { margin: 20px; }
    .form-row { display: flex; gap: 16px; align-items: center; margin: 8px 0; }
    .item-form { border-left: 3px solid #2196f3; padding-left: 16px; margin: 16px 0; }
    .actions { margin-top: 20px; }
    .actions button { margin-right: 10px; }
    h3 { color: #1976d2; margin-top: 24px; }
    .availability-section { margin-top: 16px; background: #f8f9fa; padding: 12px; border-radius: 4px; }
    .day-availability { margin: 8px 0; }
    .time-slots { margin-left: 24px; margin-top: 8px; }
    .time-slot { display: flex; gap: 16px; align-items: center; margin: 8px 0; }
    .add-slot-btn { margin-top: 8px; }
    h4 { margin: 8px 0; color: #666; }
  `]
})
export class DataInputComponent implements OnInit {
  @Output() dataGenerated = new EventEmitter<any>();
  
  dataForm: FormGroup;
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  constructor(private fb: FormBuilder) {
    this.dataForm = this.fb.group({
      teachers: this.fb.array([]),
      subjects: this.fb.array([]),
      classes: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadExample();
  }

  get teachers() { return this.dataForm.get('teachers') as FormArray; }
  get subjects() { return this.dataForm.get('subjects') as FormArray; }
  get classes() { return this.dataForm.get('classes') as FormArray; }

  addTeacher() {
    const teacher = this.fb.group({
      id: [this.teachers.length + 1],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      subjectIds: [''],
      availability: [{ 'Lundi': [{ start: '08:00', end: '16:30' }] }]
    });
    this.teachers.push(teacher);
    this.onDataChange(); // Régénération automatique
  }

  removeTeacher(index: number) {
    this.teachers.removeAt(index);
  }

  addSubject() {
    const subject = this.fb.group({
      id: [this.subjects.length + 1],
      name: ['', Validators.required],
      duration: [60, Validators.required]
    });
    this.subjects.push(subject);
    this.onDataChange(); // Régénération automatique
  }

  removeSubject(index: number) {
    this.subjects.removeAt(index);
  }

  addClass() {
    const classGroup = this.fb.group({
      id: [this.classes.length + 1],
      name: ['', Validators.required],
      subjectIds: ['']
    });
    this.classes.push(classGroup);
    this.onDataChange(); // Régénération automatique
  }

  removeClass(index: number) {
    this.classes.removeAt(index);
  }

  loadExample() {
    // Ne pas vider si des données existent déjà
    if (this.teachers.length > 0) {
      console.log('Données existantes détectées, génération directe');
      this.generateData();
      return;
    }

    // Vider
    while (this.teachers.length) this.teachers.removeAt(0);
    while (this.subjects.length) this.subjects.removeAt(0);
    while (this.classes.length) this.classes.removeAt(0);

    // Exemple
    this.addTeacher();
    this.teachers.at(0).patchValue({
      firstName: 'Jean', 
      lastName: 'Dupont', 
      subjectIds: '1',
      availability: {
        'Lundi': [{'start': '08:00', 'end': '12:00'}, {'start': '13:30', 'end': '16:30'}],
        'Mardi': [{'start': '08:00', 'end': '16:30'}],
        'Mercredi': [{'start': '08:00', 'end': '12:00'}],
        'Jeudi': [{'start': '08:00', 'end': '16:30'}],
        'Vendredi': [{'start': '08:00', 'end': '15:30'}]
      }
    });

    this.addTeacher();
    this.teachers.at(1).patchValue({
      firstName: 'Marie', 
      lastName: 'Martin', 
      subjectIds: '2',
      availability: {
        'Lundi': [{'start': '08:00', 'end': '16:30'}],
        'Mardi': [{'start': '09:00', 'end': '12:00'}, {'start': '14:00', 'end': '16:30'}],
        'Mercredi': [{'start': '08:00', 'end': '12:00'}],
        'Jeudi': [{'start': '08:00', 'end': '16:30'}],
        'Vendredi': [{'start': '08:00', 'end': '16:30'}]
      }
    });

    this.addSubject();
    this.subjects.at(0).patchValue({ name: 'Mathématiques', duration: 60 });

    this.addSubject();
    this.subjects.at(1).patchValue({ name: 'Français', duration: 60 });

    this.addClass();
    this.classes.at(0).patchValue({ name: '6ème A', subjectIds: '1,2' });

    this.addClass();
    this.classes.at(1).patchValue({ name: '6ème B', subjectIds: '1,2' });
  }

  generateData() {
    const formValue = this.dataForm.value;
    
    const data = {
      teachers: formValue.teachers.map((t: any) => ({
        ...t,
        subjects: t.subjectIds.split(',').filter((id: string) => id.trim()).map((id: string) => ({ id: parseInt(id.trim()) }))
      })),
      subjects: formValue.subjects,
      classes: formValue.classes.map((c: any) => ({
        ...c,
        subjects: c.subjectIds.split(',').filter((id: string) => id.trim()).map((id: string) => ({ id: parseInt(id.trim()) }))
      }))
    };

    console.log('Données envoyées:', data);
    this.dataGenerated.emit(data);
  }

  debugData() {
    const formValue = this.dataForm.value;
    console.log('=== DEBUG DONNEES ===');
    console.log('Enseignants:', formValue.teachers.length);
    console.log('Matières:', formValue.subjects.length);
    console.log('Classes:', formValue.classes.length);
    
    formValue.teachers.forEach((t: any, i: number) => {
      console.log(`Enseignant ${i+1}: ${t.firstName} ${t.lastName} - Matières: ${t.subjectIds}`);
    });
    
    this.generateData();
  }

  // Régénération automatique lors de modifications
  onDataChange() {
    // Délai pour éviter trop de régénérations
    setTimeout(() => {
      if (this.teachers.length > 0 && this.subjects.length > 0 && this.classes.length > 0) {
        console.log('Régénération automatique avec', this.teachers.length, 'enseignants');
        this.generateData();
      }
    }, 500); // Réduit le délai pour une réactivité plus rapide
  }

  isAvailable(teacherIndex: number, day: string): boolean {
    const availability = this.teachers.at(teacherIndex).get('availability')?.value || {};
    return !!availability[day];
  }

  toggleDay(teacherIndex: number, day: string, checked: boolean) {
    const teacher = this.teachers.at(teacherIndex);
    const availability = teacher.get('availability')?.value || {};
    
    if (checked) {
      availability[day] = [{ start: '08:00', end: '16:30' }];
    } else {
      delete availability[day];
    }
    
    teacher.get('availability')?.setValue(availability);
  }

  getStartTime(teacherIndex: number, day: string): string {
    const availability = this.teachers.at(teacherIndex).get('availability')?.value || {};
    return availability[day]?.[0]?.start || '08:00';
  }

  getEndTime(teacherIndex: number, day: string): string {
    const availability = this.teachers.at(teacherIndex).get('availability')?.value || {};
    return availability[day]?.[0]?.end || '16:30';
  }

  setStartTime(teacherIndex: number, day: string, time: string) {
    const teacher = this.teachers.at(teacherIndex);
    const availability = teacher.get('availability')?.value || {};
    if (availability[day]) {
      availability[day][0].start = time;
      teacher.get('availability')?.setValue(availability);
    }
  }

  setEndTime(teacherIndex: number, day: string, time: string) {
    const teacher = this.teachers.at(teacherIndex);
    const availability = teacher.get('availability')?.value || {};
    if (availability[day]) {
      availability[day][0].end = time;
      teacher.get('availability')?.setValue(availability);
    }
  }

  getTimeSlots(teacherIndex: number, day: string): any[] {
    const availability = this.teachers.at(teacherIndex).get('availability')?.value || {};
    return availability[day] || [];
  }

  addTimeSlot(teacherIndex: number, day: string) {
    const teacher = this.teachers.at(teacherIndex);
    const availability = teacher.get('availability')?.value || {};
    
    if (!availability[day]) {
      availability[day] = [];
    }
    
    availability[day].push({ start: '08:00', end: '12:00' });
    teacher.get('availability')?.setValue(availability);
  }

  removeTimeSlot(teacherIndex: number, day: string, slotIndex: number) {
    const teacher = this.teachers.at(teacherIndex);
    const availability = teacher.get('availability')?.value || {};
    
    if (availability[day] && availability[day].length > 1) {
      availability[day].splice(slotIndex, 1);
      teacher.get('availability')?.setValue(availability);
    }
  }

  updateTimeSlot(teacherIndex: number, day: string, slotIndex: number, field: string, value: string) {
    const teacher = this.teachers.at(teacherIndex);
    const availability = teacher.get('availability')?.value || {};
    
    if (availability[day] && availability[day][slotIndex]) {
      availability[day][slotIndex][field] = value;
      teacher.get('availability')?.setValue(availability);
    }
  }
}