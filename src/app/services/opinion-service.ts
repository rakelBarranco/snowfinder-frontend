import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Opinion} from '../interfaces/interfaz-estacion';
import {environment} from '../../enviroments/environment';


@Injectable({
  providedIn: 'root'
})
export class OpinionService {
  private apiUrl = `${environment.apiUrl}/api/opiniones`;
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

  getTodasOpiniones(): Observable<Opinion[]> {
    return this.http.get<Opinion[]>(`${this.apiUrl}/todas`);
  }
}
