import {Component, inject, OnInit} from '@angular/core';
import {EstacionService} from '../../../services/estacion-service';
import {Estacion} from '../../../interfaces/interfaz-estacion';
import {FormsModule} from '@angular/forms';
import {NotificationService} from '../../../services/notification-service';

@Component({
  selector: 'app-admin-page',
  imports: [
    FormsModule
  ],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.css',
})
export default class AdminPage implements OnInit {

  private estacionService = inject(EstacionService);
  private notificationService = inject(NotificationService);

  estaciones: Estacion[] = [];
  loading = true;
  modoEdicion = false;
  estacionSeleccionada: Partial<Estacion> = {};
  estacionAEliminar: number | null = null;

  ngOnInit() {
    this.cargarEstaciones();
  }

  cargarEstaciones() {
    this.estacionService.getEstaciones().subscribe({
      next: data => {
        this.estaciones = data;
        this.loading = false;
      }
    });
  }

  guardarEstacion() {
    if (this.estacionSeleccionada.id) {
      this.estacionService.updateEstacion(
        this.estacionSeleccionada.id,
        this.estacionSeleccionada as Estacion
      ).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarEstaciones();
          this.notificationService.exito('Estación actualizada correctamente');
        },
        error: () => this.notificationService.error('Error al actualizar la estación')
      });
    } else {
      this.estacionService.createEstacion(this.estacionSeleccionada as Estacion).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarEstaciones();
          this.notificationService.exito('Estación creada correctamente');
        },
        error: () => this.notificationService.error('Error al crear la estación')
      });
    }
  }

  confirmarEliminar() {
    if (this.estacionAEliminar === null) return;
    this.estacionService.deleteEstacion(this.estacionAEliminar).subscribe({
      next: () => {
        this.cargarEstaciones();
        this.estacionAEliminar = null;
        const modal = document.getElementById('modalEliminarEstacion');
        if (modal) (window as any).bootstrap.Modal.getInstance(modal)?.hide();
        this.notificationService.exito('Estación eliminada correctamente');
      },
      error: () => this.notificationService.error('Error al eliminar la estación')
    });
  }

  cancelar() {
    this.modoEdicion = false;
    this.estacionSeleccionada = {};
  }

  abrirModalNueva() {
    this.estacionSeleccionada = {};
    const modal = document.getElementById('modalEstacion');
    if (modal) new (window as any).bootstrap.Modal(modal).show();
  }

  abrirModalEdicion(estacion: Estacion) {
    this.estacionSeleccionada = { ...estacion };
    const modal = document.getElementById('modalEstacion');
    if (modal) new (window as any).bootstrap.Modal(modal).show();
  }

  cerrarModal() {
    const modal = document.getElementById('modalEstacion');
    if (modal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
      bsModal?.hide();
    }
  }


  abrirModalEliminar(id: number) {
    this.estacionAEliminar = id;
    const modal = document.getElementById('modalEliminarEstacion');
    if (modal) new (window as any).bootstrap.Modal(modal).show();
  }


}
