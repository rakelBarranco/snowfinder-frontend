import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: 'exito' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificaciones$ = new BehaviorSubject<Notificacion[]>([]);
  notificaciones = this.notificaciones$.asObservable();
  private contador = 0;

  exito(mensaje: string) {
    this.agregar(mensaje, 'exito');
  }

  error(mensaje: string) {
    this.agregar(mensaje, 'error');
  }

  info(mensaje: string) {
    this.agregar(mensaje, 'info');
  }

  private agregar(mensaje: string, tipo: 'exito' | 'error' | 'info') {
    const id = this.contador++;
    const actual = this.notificaciones$.value;
    this.notificaciones$.next([...actual, {id, mensaje, tipo}]);
    setTimeout(() => this.eliminar(id), 3500);
  }

  eliminar(id: number) {
    this.notificaciones$.next(
      this.notificaciones$.value.filter(n => n.id !== id)
    );
  }
}
