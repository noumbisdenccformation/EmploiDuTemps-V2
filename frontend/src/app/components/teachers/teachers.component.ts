import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-teachers',
  template: `
    <div class="teachers-container">
      <h1>Gestion des Enseignants</h1>
      
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>Ajouter un Enseignant</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="teacherForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field>
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="firstName" required>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Nom</mat-label>
                <input matInput formControlName="lastName" required>
              </mat-form-field>
            </div>
            
            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
            </mat-form-field>
            
            <mat-form-field class="full-width">
              <mat-label>Téléphone</mat-label>
              <input matInput formControlName="phone">
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" [disabled]="!teacherForm.valid">
              Ajouter
            </button>
          </form>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="list-card">
        <mat-card-header>
          <mat-card-title>Liste des Enseignants</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="teachers" class="teachers-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let teacher">{{teacher.firstName}} {{teacher.lastName}}</td>
            </ng-container>
            
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let teacher">{{teacher.email}}</td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let teacher">
                <button mat-icon-button color="primary">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .teachers-container { padding: 20px; }
    .form-card, .list-card { margin-bottom: 20px; }
    .form-row { display: flex; gap: 16px; }
    .full-width { width: 100%; }
    .teachers-table { width: 100%; }
    mat-form-field { margin-bottom: 16px; }
  `]
})
export class TeachersComponent implements OnInit {
  teacherForm: FormGroup;
  teachers: any[] = [];
  displayedColumns = ['name', 'email', 'actions'];

  constructor(private fb: FormBuilder) {
    this.teacherForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.teacherForm.valid) {
      this.teachers.push(this.teacherForm.value);
      this.teacherForm.reset();
    }
  }
}