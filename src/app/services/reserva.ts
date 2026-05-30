import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../enviroments/environment';
import {Reserva} from '../interfaces/interfaz-estacion';


@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/api/reservas`;
  private http = inject(HttpClient);

  getMisReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/mis-reservas`);
  }

  crearReserva(estacionId: number, fecha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/estacion/${estacionId}`, { fecha });
  }

  cancelarReserva(reservaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reservaId}`);
  }
}
