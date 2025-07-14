import { Component, OnInit } from '@angular/core';
import { PdfService } from './services/pdf.service';
import { TimetableService } from './services/timetable.service';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Emploi du Temps Scolaire';
  currentLang = 'fr';
  availableLanguages: any[] = [];
  
  menuItems = [
    { name: 'Emploi du temps', route: '/timetable', icon: 'schedule', translationKey: 'menu.timetable' },
    { name: 'Affectations', route: '/assignments', icon: 'assignment', translationKey: 'menu.assignments' }
    // { name: 'Salles', route: '/rooms', icon: 'meeting_room' }, // Prochaine version
  ];

  constructor(
    private pdfService: PdfService,
    private timetableService: TimetableService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.availableLanguages = this.translationService.getAvailableLanguages();
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  changeLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
  }

  generateAllPDF() {
    // Cette méthode sera appelée par le bouton global PDF
    this.timetableService.getLastGeneratedSchedules().subscribe(result => {
      if (result?.data) {
        const allSchedules = [];
        
        // Ajouter tous les emplois du temps des classes
        if (result.data.byClass) {
          Object.keys(result.data.byClass).forEach(className => {
            const schedule = this.convertClassScheduleToPDF(className, result.data.byClass[className]);
            allSchedules.push({ schedule, title: `Emploi du temps - ${className}` });
          });
        }
        
        // Ajouter tous les emplois du temps des enseignants
        if (result.data.byTeacher) {
          Object.keys(result.data.byTeacher).forEach(teacherName => {
            const schedule = this.convertTeacherScheduleToPDF(teacherName, result.data.byTeacher[teacherName]);
            allSchedules.push({ schedule, title: `Emploi du temps - ${teacherName}` });
          });
        }
        
        this.pdfService.generateAllSchedulesPDF(allSchedules)
          .subscribe(blob => {
            this.pdfService.downloadPDF(blob, 'tous_les_emplois_du_temps.pdf');
          });
      }
    });
  }

  private convertClassScheduleToPDF(className: string, classData: any): any[] {
    const schedule = [];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:30-13:30', '13:30-14:30', '14:30-15:30', '15:30-16:30'];
    
    for (const day of days) {
      for (const timeSlot of timeSlots) {
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
    return schedule;
  }

  private convertTeacherScheduleToPDF(teacherName: string, teacherData: any): any[] {
    const schedule = [];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:30-13:30', '13:30-14:30', '14:30-15:30', '15:30-16:30'];
    
    for (const day of days) {
      for (const timeSlot of timeSlots) {
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
    return schedule;
  }
}