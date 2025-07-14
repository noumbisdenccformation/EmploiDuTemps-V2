import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>('fr');
  public currentLang$ = this.currentLangSubject.asObservable();

  private translations = {
    fr: {
      // Header
      'app.title': 'Emploi du Temps Scolaire',
      'menu.timetable': 'Emploi du temps',
      'menu.assignments': 'Affectations',
      'menu.export_all': 'Exporter tous les PDF',
      'language': 'Langue',
      
      // Timetable page
      'timetable.title': 'Génération d\'Emploi du Temps',
      'timetable.subtitle': 'Utilisez la page "Affectations" pour configurer enseignants, matières et classes',
      'timetable.summary': 'Résumé des données',
      'timetable.teachers': 'Enseignants',
      'timetable.subjects': 'Matières',
      'timetable.classes': 'Classes',
      'timetable.assignments': 'Affectations',
      'timetable.conflicts': 'Conflits',
      'timetable.by_class': 'Par Classe',
      'timetable.by_teacher': 'Par Enseignant',
      'timetable.debug_info': 'Informations de débogage :',
      'timetable.assignments_count': 'Nombre d\'affectations :',
      'timetable.teachers_count': 'Nombre d\'enseignants :',
      'timetable.subjects_count': 'Nombre de matières :',
      'timetable.classes_count': 'Nombre de classes :',
      'timetable.generating': 'Génération en cours',
      
      // Assignments page
      'assignments.title': 'Gestion Complète des Affectations',
      'assignments.teachers_section': 'Enseignants',
      'assignments.subjects_section': 'Matières',
      'assignments.classes_section': 'Classes',
      'assignments.assignments_section': 'Affectations',
      'assignments.availability': 'Disponibilités',
      'assignments.all_week': 'Toute la semaine',
      'assignments.add_teacher': 'Ajouter Enseignant',
      'assignments.add_subject': 'Ajouter Matière',
      'assignments.add_class': 'Ajouter Classe',
      'assignments.create_assignment': 'Créer Affectation',
      'assignments.first_name': 'Prénom',
      'assignments.last_name': 'Nom',
      'assignments.subject_name': 'Nom de la matière',
      'assignments.duration': 'Durée (h)',
      'assignments.max_per_day': 'Max par jour',
      'assignments.class_name': 'Nom de la classe',
      'assignments.select_teacher': 'Sélectionner un enseignant',
      'assignments.select_subject': 'Sélectionner une matière',
      'assignments.select_class': 'Sélectionner une classe',
      'assignments.hours_per_week': 'Heures/semaine',
      'assignments.teaches': 'enseigne',
      'assignments.to': 'à',
      'assignments.time_slots': 'Créneaux horaires',
      'assignments.add_time_slot': 'Ajouter créneau',
      
      // Days
      'day.monday': 'Lundi',
      'day.tuesday': 'Mardi',
      'day.wednesday': 'Mercredi',
      'day.thursday': 'Jeudi',
      'day.friday': 'Vendredi',
      
      // Common
      'common.hour': 'Heure',
      'common.pdf': 'PDF',
      'common.generate_all_pdf': 'Générer tous les PDF',
      'common.add_slot': 'Ajouter créneau',
      
      // Footer
      'footer.copyright': '© 2024 NCCformation - Tous droits réservés',
      'common.refresh': 'Actualiser les Données',
      'timetable.create_assignments_first': 'Veuillez d\'abord créer des affectations dans la page "Affectations"'
    },
    en: {
      // Header
      'app.title': 'School Timetable',
      'menu.timetable': 'Timetable',
      'menu.assignments': 'Assignments',
      'menu.export_all': 'Export all PDFs',
      'language': 'Language',
      
      // Timetable page
      'timetable.title': 'Timetable Generation',
      'timetable.subtitle': 'Use the "Assignments" page to configure teachers, subjects and classes',
      'timetable.summary': 'Data Summary',
      'timetable.teachers': 'Teachers',
      'timetable.subjects': 'Subjects',
      'timetable.classes': 'Classes',
      'timetable.assignments': 'Assignments',
      'timetable.conflicts': 'Conflicts',
      'timetable.by_class': 'By Class',
      'timetable.by_teacher': 'By Teacher',
      'timetable.debug_info': 'Debug Information:',
      'timetable.assignments_count': 'Number of assignments:',
      'timetable.teachers_count': 'Number of teachers:',
      'timetable.subjects_count': 'Number of subjects:',
      'timetable.classes_count': 'Number of classes:',
      'timetable.generating': 'Generating',
      
      // Assignments page
      'assignments.title': 'Complete Assignment Management',
      'assignments.teachers_section': 'Teachers',
      'assignments.subjects_section': 'Subjects',
      'assignments.classes_section': 'Classes',
      'assignments.assignments_section': 'Assignments',
      'assignments.availability': 'Availability',
      'assignments.all_week': 'All week',
      'assignments.add_teacher': 'Add Teacher',
      'assignments.add_subject': 'Add Subject',
      'assignments.add_class': 'Add Class',
      'assignments.create_assignment': 'Create Assignment',
      'assignments.first_name': 'First Name',
      'assignments.last_name': 'Last Name',
      'assignments.subject_name': 'Subject Name',
      'assignments.duration': 'Duration (h)',
      'assignments.max_per_day': 'Max per day',
      'assignments.class_name': 'Class Name',
      'assignments.select_teacher': 'Select a teacher',
      'assignments.select_subject': 'Select a subject',
      'assignments.select_class': 'Select a class',
      'assignments.hours_per_week': 'Hours/week',
      'assignments.teaches': 'teaches',
      'assignments.to': 'to',
      'assignments.time_slots': 'Time slots',
      'assignments.add_time_slot': 'Add slot',
      
      // Days
      'day.monday': 'Monday',
      'day.tuesday': 'Tuesday',
      'day.wednesday': 'Wednesday',
      'day.thursday': 'Thursday',
      'day.friday': 'Friday',
      
      // Common
      'common.hour': 'Time',
      'common.pdf': 'PDF',
      'common.generate_all_pdf': 'Generate all PDFs',
      'common.add_slot': 'Add slot',
      
      // Footer
      'footer.copyright': '© 2024 NCCformation - All rights reserved',
      'common.refresh': 'Refresh Data',
      'timetable.create_assignments_first': 'Please first create assignments in the "Assignments" page'
    }
  };

  constructor() {
    // Récupérer la langue sauvegardée ou utiliser français par défaut
    const savedLang = localStorage.getItem('app-language') || 'fr';
    this.currentLangSubject.next(savedLang);
  }

  getCurrentLang(): string {
    return this.currentLangSubject.value;
  }

  setLanguage(lang: string): void {
    this.currentLangSubject.next(lang);
    localStorage.setItem('app-language', lang);
  }

  translate(key: string): string {
    const lang = this.getCurrentLang();
    return this.translations[lang as keyof typeof this.translations]?.[key as keyof typeof this.translations.fr] || key;
  }

  getAvailableLanguages() {
    return [
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇬🇧' }
    ];
  }
}