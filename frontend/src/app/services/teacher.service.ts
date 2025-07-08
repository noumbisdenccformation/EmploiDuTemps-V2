import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private endpoint = '/teachers';

  constructor(private api: ApiService) {}

  getAll(): Observable<Teacher[]> {
    return this.api.get<Teacher[]>(this.endpoint);
  }

  getById(id: number): Observable<Teacher> {
    return this.api.get<Teacher>(`${this.endpoint}/${id}`);
  }

  create(teacher: Teacher): Observable<Teacher> {
    return this.api.post<Teacher>(this.endpoint, teacher);
  }

  update(id: number, teacher: Teacher): Observable<Teacher> {
    return this.api.put<Teacher>(`${this.endpoint}/${id}`, teacher);
  }

  delete(id: number): Observable<any> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}