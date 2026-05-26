import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  private apiUrl = 'http://localhost:8080/api/imagenes';
  private http = inject(HttpClient);

  getImagenesByEstacion(estacionId: number): Observable<{id: number, url: string}[]> {
    return this.http.get<{id: number, url: string}[]>(`${this.apiUrl}/estacion/${estacionId}`);
  }

  addImagen(estacionId: number, url: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/estacion/${estacionId}`, { url });
  }

  deleteImagen(imagenId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${imagenId}`);
  }

  uploadImagen(estacionId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`http://localhost:8080/api/files/upload/${estacionId}`, formData);
  }
}
