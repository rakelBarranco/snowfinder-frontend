import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginResponse, RegisterResponse} from '../interfaces/interfaz-auth';
import {environment} from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/auth`;
  private http = inject(HttpClient);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  register(nombre: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, { nombre, email, password });
  }

  guardarToken(token: string, rol: string, nombre: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
    localStorage.setItem('nombre', nombre);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  getNombre(): string | null {
    return localStorage.getItem('nombre');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
  }

  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  actualizarNombre(nombre: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/nombre`, { nombre });
  }

  cambiarPassword(passwordActual: string, passwordNueva: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, { passwordActual, passwordNueva });
  }

  eliminarCuenta(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cuenta`);
  }

  subirFotoPerfil(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/api/files/upload/perfil`, formData);
  }
}
