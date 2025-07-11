import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = `${environment.apiUrl}/pdf`;

  constructor(private http: HttpClient) {}

  generateSchedulePDF(schedule: any[], title: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/schedule`, 
      { schedule, title }, 
      { responseType: 'blob' }
    );
  }

  generateAllSchedulesPDF(schedules: { schedule: any[], title: string }[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/all-schedules`, 
      { schedules }, 
      { responseType: 'blob' }
    );
  }

  downloadPDF(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}