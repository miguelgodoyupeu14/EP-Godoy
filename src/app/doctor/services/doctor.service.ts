import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private ApiUrl = "http://localhost:8080/doctores";

  constructor(private http: HttpClient) { }

  getDoctores(): Observable<Doctor[]>{
    return this.http.get<Doctor[]>(this.ApiUrl);
  }
  getDoctorByID(id:number): Observable<Doctor>{
    return this.http.get<Doctor>(`${this.ApiUrl}/${id}`);
  }
  updateDoctor(id: number, doctor: Doctor) : Observable<Doctor>{
    return this.http.put<Doctor>(`${this.ApiUrl}/${id}`, doctor);
  }
  deleteDoctor(id:number): Observable<Doctor>{
    return this.http.delete<Doctor>(`${this.ApiUrl}/${id}`);
  }
  crearDoctor(doctor : Doctor): Observable<Doctor>{
    return this.http.post<Doctor>(this.ApiUrl, doctor);
  }
}
