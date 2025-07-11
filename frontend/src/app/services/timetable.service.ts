import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  private endpoint = '/timetables';
  private lastGeneratedResult: any = null;

  constructor(private api: ApiService) {}

  generate(data: any): Observable<any> {
    return this.api.post(`${this.endpoint}/generate`, data);
  }

  generateByClass(data: any): Observable<any> {
    return this.api.post(`${this.endpoint}/generate/by-class`, data);
  }

  generateByTeacher(data: any): Observable<any> {
    return this.api.post(`${this.endpoint}/generate/by-teacher`, data);
  }

  validate(timetableData: any): Observable<any> {
    return this.api.post(`${this.endpoint}/validate`, { timetableData });
  }

  // Stocker le dernier résultat généré
  setLastGeneratedResult(result: any): void {
    this.lastGeneratedResult = result;
  }

  // Récupérer le dernier résultat généré
  getLastGeneratedSchedules(): Observable<any> {
    return new Observable(observer => {
      observer.next(this.lastGeneratedResult);
      observer.complete();
    });
  }
}