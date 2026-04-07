import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Estacion} from '../interfaces/interfaz-estacion';


@Injectable({
  providedIn: 'root'
})
export class EstacionService {
  private apiUrl = 'http://localhost:8080/api/estaciones';
  private http = inject(HttpClient);

  getEstaciones(): Observable<Estacion[]> {
    return this.http.get<Estacion[]>(this.apiUrl);
  }

  getEstacionById(id: number): Observable<Estacion> {
    return this.http.get<Estacion>(`${this.apiUrl}/${id}`);
  }

  createEstacion(estacion: Estacion): Observable<Estacion> {
    return this.http.post<Estacion>(this.apiUrl, estacion);
  }

  updateEstacion(id: number, estacion: Estacion): Observable<Estacion> {
    return this.http.put<Estacion>(`${this.apiUrl}/${id}`, estacion);
  }

  deleteEstacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
