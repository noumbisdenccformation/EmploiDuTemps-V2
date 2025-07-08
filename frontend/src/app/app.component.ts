import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Emploi du Temps Scolaire';
  
  menuItems = [
    { name: 'Emploi du temps', route: '/timetable', icon: 'schedule' }
  ];
}