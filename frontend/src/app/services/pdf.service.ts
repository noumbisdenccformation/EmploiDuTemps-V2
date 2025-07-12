import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = `${environment.apiUrl}/pdf`;

  constructor(private http: HttpClient) {
    // Configuration automatique selon l'environnement
    if (window.location.hostname !== 'localhost') {
      this.apiUrl = 'https://emploi-temps-backend.onrender.com/api/pdf';
    }
  }

  generateSchedulePDF(schedule: any[], title: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/schedule`, 
      { schedule, title }, 
      { responseType: 'blob' }
    ).pipe(
      catchError(error => {
        console.warn('Backend PDF non disponible, génération HTML:', error);
        // Fallback vers HTML
        const htmlContent = this.generateScheduleHTML(schedule, title);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        return of(blob);
      })
    );
  }

  private generateScheduleHTML(schedule: any[], title: string): string {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '13:30-14:30', '14:30-15:30', '15:30-16:30'];
    
    let tableRows = '';
    timeSlots.forEach(slot => {
      let row = `<tr><td><strong>${slot}</strong></td>`;
      days.forEach(day => {
        const course = schedule.find(c => c.day === day && c.timeSlot === slot);
        if (course) {
          row += `<td class="course">
            <div><strong>${course.subject}</strong></div>
            <div>${course.teacher || course.class || ''}</div>
            <div style="color: #666; font-size: 12px;">${course.room || ''}</div>
          </td>`;
        } else {
          row += '<td></td>';
        }
      });
      row += '</tr>';
      tableRows += row;
    });
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { text-align: center; color: #2c3e50; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #333; padding: 10px; text-align: center; }
    th { background-color: #3498db; color: white; font-weight: bold; }
    .course { background-color: #f8f9fa; }
    .course strong { color: #2c3e50; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <table>
    <thead>
      <tr>
        <th>Horaire</th>
        <th>Lundi</th>
        <th>Mardi</th>
        <th>Mercredi</th>
        <th>Jeudi</th>
        <th>Vendredi</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
</body>
</html>`;
  }

  generateAllSchedulesPDF(schedules: { schedule: any[], title: string }[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/all-schedules`, 
      { schedules }, 
      { responseType: 'blob' }
    ).pipe(
      catchError(error => {
        console.warn('Backend PDF non disponible, génération HTML combinée:', error);
        // Fallback vers HTML combiné
        let combinedHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Tous les Emplois du Temps</title><style>body{font-family:Arial,sans-serif;margin:20px}h1{text-align:center;color:#2c3e50;page-break-before:always}h1:first-child{page-break-before:auto}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #333;padding:8px;text-align:center}th{background-color:#3498db;color:white}.course{background-color:#f8f9fa}</style></head><body>`;
        
        schedules.forEach(({ schedule, title }) => {
          combinedHTML += this.generateScheduleHTML(schedule, title).replace(/<!DOCTYPE html>[\s\S]*<body>/, '').replace('</body></html>', '');
        });
        
        combinedHTML += '</body></html>';
        const blob = new Blob([combinedHTML], { type: 'text/html' });
        return of(blob);
      })
    );
  }

  downloadPDF(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Forcer le téléchargement avec extension correcte
    link.download = filename.endsWith('.html') ? filename : filename.replace('.pdf', '.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}