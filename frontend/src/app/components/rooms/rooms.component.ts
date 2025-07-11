import { Component, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-rooms',
  template: `
    <div class="rooms-container">
      <h2>Gestion des Salles</h2>
      
      <div class="add-room">
        <h3>{{ editingRoom ? 'Modifier' : 'Ajouter' }} une salle</h3>
        <form (ngSubmit)="saveRoom()" #roomForm="ngForm">
          <input [(ngModel)]="currentRoom.name" name="name" placeholder="Nom de la salle" required>
          <input [(ngModel)]="currentRoom.code" name="code" placeholder="Code" required>
          <select [(ngModel)]="currentRoom.type" name="type" required>
            <option value="classroom">Salle de classe</option>
            <option value="laboratory">Laboratoire</option>
            <option value="amphitheater">Amphithéâtre</option>
          </select>
          <select [(ngModel)]="currentRoom.status" name="status" required>
            <option value="unique">Unique (dédiée)</option>
            <option value="commune">Commune (partagée)</option>
          </select>
          <input [(ngModel)]="currentRoom.capacity" name="capacity" type="number" placeholder="Capacité" required>
          <button type="submit" [disabled]="!roomForm.form.valid">
            {{ editingRoom ? 'Modifier' : 'Ajouter' }}
          </button>
          <button type="button" (click)="cancelEdit()" *ngIf="editingRoom">Annuler</button>
        </form>
      </div>

      <div class="rooms-list">
        <h3>Liste des Salles</h3>
        <div class="room-card" *ngFor="let room of rooms">
          <h4>{{ room.name }} ({{ room.code }})</h4>
          <p>Type: {{ getRoomTypeLabel(room.type) }}</p>
          <p>Capacité: {{ room.capacity }} places</p>
          <div class="actions">
            <button (click)="editRoom(room)">Modifier</button>
            <button (click)="deleteRoom(room.id!)" class="delete">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rooms-container { padding: 20px; }
    .add-room form { display: flex; gap: 10px; margin-bottom: 20px; }
    .add-room input, .add-room select { padding: 8px; }
    .room-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .actions { margin-top: 10px; }
    .actions button { margin-right: 10px; padding: 5px 10px; }
    .delete { background-color: #e74c3c; color: white; }
  `]
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  currentRoom: Room = this.getEmptyRoom();
  editingRoom = false;

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        console.log('Salles chargées:', rooms);
        this.rooms = rooms;
      },
      error: (error) => {
        console.error('Erreur chargement salles:', error);
        this.rooms = [];
      }
    });
  }

  saveRoom() {
    console.log('Tentative de sauvegarde:', this.currentRoom);
    if (this.editingRoom) {
      this.roomService.updateRoom(this.currentRoom.id!, this.currentRoom).subscribe({
        next: () => {
          this.loadRooms();
          this.resetForm();
        },
        error: (error) => {
          console.error('Erreur modification:', error);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      this.roomService.createRoom(this.currentRoom).subscribe({
        next: () => {
          console.log('Salle créée avec succès');
          this.loadRooms();
          this.resetForm();
        },
        error: (error) => {
          console.error('Erreur création:', error);
          alert('Erreur lors de la création: ' + error.message);
        }
      });
    }
  }

  editRoom(room: Room) {
    this.currentRoom = { ...room };
    this.editingRoom = true;
  }

  deleteRoom(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      this.roomService.deleteRoom(id).subscribe(() => {
        this.loadRooms();
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.currentRoom = this.getEmptyRoom();
    this.editingRoom = false;
  }

  getEmptyRoom(): any {
    return {
      name: '',
      code: '',
      type: 'classroom',
      status: 'unique',
      capacity: 30,
      isActive: true
    };
  }

  getRoomTypeLabel(type: string): string {
    const labels = {
      'classroom': 'Salle de classe',
      'laboratory': 'Laboratoire',
      'amphitheater': 'Amphithéâtre'
    };
    return labels[type as keyof typeof labels] || type;
  }
}