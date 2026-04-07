import {Component, inject, OnInit} from '@angular/core';
import {EstacionService} from '../../../services/estacion-service';
import {Estacion} from '../../../interfaces/interfaz-estacion';
import {FormsModule} from '@angular/forms';

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

  estaciones: Estacion[] = [];
  loading = true;
  modoEdicion = false;
  estacionSeleccionada: Partial<Estacion> = {};

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

  nuevaEstacion() {
    this.modoEdicion = true;
    this.estacionSeleccionada = {};
  }

  editarEstacion(estacion: Estacion) {
    this.modoEdicion = true;
    this.estacionSeleccionada = { ...estacion };
  }

  guardarEstacion() {
    if (this.estacionSeleccionada.id) {
      this.estacionService.updateEstacion(
        this.estacionSeleccionada.id,
        this.estacionSeleccionada as Estacion
      ).subscribe({
        next: () => {
          this.modoEdicion = false;
          this.cargarEstaciones();
        }
      });
    } else {
      this.estacionService.createEstacion(this.estacionSeleccionada as Estacion).subscribe({
        next: () => {
          this.modoEdicion = false;
          this.cargarEstaciones();
        }
      });
    }
  }

  eliminarEstacion(id: number) {
    if (confirm('¿Seguro que quieres eliminar esta estación?')) {
      this.estacionService.deleteEstacion(id).subscribe({
        next: () => this.cargarEstaciones()
      });
    }
  }

  cancelar() {
    this.modoEdicion = false;
    this.estacionSeleccionada = {};
  }

}
