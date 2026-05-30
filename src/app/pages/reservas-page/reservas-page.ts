import {Component, inject, OnInit} from '@angular/core';
import {NotificationService} from '../../services/notification-service';
import {ReservaService} from '../../services/reserva';
import {Reserva} from '../../interfaces/interfaz-estacion';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-reservas-page',
  imports: [
    RouterLink
  ],
  templateUrl: './reservas-page.html',
  styleUrl: './reservas-page.css',
})
export default class ReservasPage implements OnInit {

  private reservaService = inject(ReservaService);
  private notificationService = inject(NotificationService);

  reservas: Reserva[] = [];
  loading = true;

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    this.reservaService.getMisReservas().subscribe({
      next: data => {
        this.reservas = data;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Error al cargar las reservas');
        this.loading = false;
      }
    });
  }

  cancelarReserva(id: number) {
    this.reservaService.cancelarReserva(id).subscribe({
      next: () => {
        this.reservas = this.reservas.filter(r => r.id !== id);
        this.notificationService.exito('Reserva cancelada correctamente');
      },
      error: () => this.notificationService.error('Error al cancelar la reserva')
    });
  }

  formatearFecha(fecha: string): string {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
