import { Injectable } from '@angular/core';
import { Especialidad } from '../models/especialidad';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private ApiUrl = "http://localhost:8080/especialidades";

  constructor(private http: HttpClient) { }

  getEspecialidades(): Observable<Especialidad[]>{
    return this.http.get<Especialidad[]>(this.ApiUrl);
  }
  getEspecialidadByID(id:number): Observable<Especialidad>{
    return this.http.get<Especialidad>(`${this.ApiUrl}/${id}`);
  }
  updateEspecialidad(id: number, especialidad: Especialidad) : Observable<Especialidad>{
    return this.http.put<Especialidad>(`${this.ApiUrl}/${id}`, especialidad);
  }
  deleteEspecialidad(id:number): Observable<Especialidad>{
    return this.http.delete<Especialidad>(`${this.ApiUrl}/${id}`);
  }
  crearEspecialidad(especialidad : Especialidad): Observable<Especialidad>{
    return this.http.post<Especialidad>(this.ApiUrl, especialidad);
  }

}
