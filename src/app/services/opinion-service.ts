import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Opinion} from '../interfaces/interfaz-estacion';


@Injectable({
  providedIn: 'root'
})
export class OpinionService {
  private apiUrl = 'http://localhost:8080/api/opiniones';
  private http = inject(HttpClient);

  getOpinionesByEstacion(estacionId: number): Observable<Opinion[]> {
    return this.http.get<Opinion[]>(`${this.apiUrl}/estacion/${estacionId}`);
  }

  addOpinion(estacionId: number, puntuacion: number, comentario: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/estacion/${estacionId}`, { puntuacion, comentario });
  }

  deleteOpinion(opinionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${opinionId}`);
  }

  getMisOpiniones(): Observable<Opinion[]> {
    return this.http.get<Opinion[]>(`${this.apiUrl}/mis-opiniones`);
  }
}
