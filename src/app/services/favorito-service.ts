import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Estacion} from '../interfaces/interfaz-estacion';

@Injectable({
  providedIn: 'root',
})
export class FavoritoService {

  private apiUrl = 'http://localhost:8080/api/favoritos';
  private http = inject(HttpClient);

  getMisFavoritos(): Observable<Estacion[]> {
    return this.http.get<Estacion[]>(this.apiUrl);
  }

  addFavorito(estacionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${estacionId}`, {});
  }

  removeFavorito(estacionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${estacionId}`);
  }

}
