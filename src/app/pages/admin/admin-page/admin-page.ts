import {Component, inject, OnInit} from '@angular/core';
import {EstacionService} from '../../../services/estacion-service';
import {ImagenService} from '../../../services/imagen-service';
import {NotificationService} from '../../../services/notification-service';
import {ModalService} from '../../../services/modal-service';
import {Estacion} from '../../../interfaces/interfaz-estacion';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-page',
  imports: [FormsModule],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.css',
})
export default class AdminPage implements OnInit {

  private estacionService = inject(EstacionService);
  private imagenService = inject(ImagenService);
  private notificationService = inject(NotificationService);
  private modalService = inject(ModalService);

  estaciones: Estacion[] = [];
  loading = true;
  estacionSeleccionada: Partial<Estacion> = {};
  estacionAEliminar: number | null = null;
  estacionImagenes: Estacion | null = null;
  nuevaImagenUrl = '';
  archivoSeleccionado: File | null = null;

  // Errores del formulario de estación
  erroresEstacion: Partial<Record<keyof Estacion, string>> = {};

  // Error de URL de imagen
  errorUrl = '';

  ngOnInit() {
    this.cargarEstaciones();
  }

  cargarEstaciones() {
    this.loading = true;
    this.estacionService.getEstaciones().subscribe({
      next: data => {
        this.estaciones = data;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Error al cargar las estaciones');
        this.loading = false;
      }
    });
  }

  abrirModalNueva() {
    this.estacionSeleccionada = {};
    this.erroresEstacion = {};
    this.modalService.open('modalEstacion');
  }

  abrirModalEdicion(estacion: Estacion) {
    this.estacionSeleccionada = { ...estacion };
    this.erroresEstacion = {};
    this.modalService.open('modalEstacion');
  }

  private validarEstacion(): boolean {
    const e = this.estacionSeleccionada;
    const err: Partial<Record<keyof Estacion, string>> = {};

    if (!e.nombre?.trim())
      err.nombre = 'El nombre es obligatorio';

    if (!e.pais?.trim())
      err.pais = 'El país es obligatorio';

    if (e.kmPistas == null || e.kmPistas <= 0)
      err.kmPistas = 'Introduce un valor mayor que 0';

    if (e.altitud == null || e.altitud <= 0)
      err.altitud = 'Introduce un valor mayor que 0';

    if (e.latitud == null || e.latitud < -90 || e.latitud > 90)
      err.latitud = 'Latitud entre -90 y 90';

    if (e.longitud == null || e.longitud < -180 || e.longitud > 180)
      err.longitud = 'Longitud entre -180 y 180';

    if (!e.descripcion?.trim())
      err.descripcion = 'La descripción es obligatoria';

    this.erroresEstacion = err;
    return Object.keys(err).length === 0;
  }

  guardarEstacion() {
    if (!this.validarEstacion()) return;

    if (this.estacionSeleccionada.id) {
      this.estacionService.updateEstacion(
        this.estacionSeleccionada.id,
        this.estacionSeleccionada as Estacion
      ).subscribe({
        next: () => {
          this.modalService.close('modalEstacion');
          this.cargarEstaciones();
          this.notificationService.exito('Estación actualizada correctamente');
        },
        error: () => this.notificationService.error('Error al actualizar la estación')
      });
    } else {
      this.estacionService.createEstacion(this.estacionSeleccionada as Estacion).subscribe({
        next: () => {
          this.modalService.close('modalEstacion');
          this.cargarEstaciones();
          this.notificationService.exito('Estación creada correctamente');
        },
        error: () => this.notificationService.error('Error al crear la estación')
      });
    }
  }

  abrirModalEliminar(id: number) {
    this.estacionAEliminar = id;
    this.modalService.open('modalEliminarEstacion');
  }

  confirmarEliminar() {
    if (this.estacionAEliminar === null) return;
    this.estacionService.deleteEstacion(this.estacionAEliminar).subscribe({
      next: () => {
        this.modalService.close('modalEliminarEstacion');
        this.estacionAEliminar = null;
        this.cargarEstaciones();
        this.notificationService.exito('Estación eliminada correctamente');
      },
      error: () => this.notificationService.error('Error al eliminar la estación')
    });
  }

  abrirModalImagenes(estacion: Estacion) {
    this.estacionImagenes = { ...estacion };
    this.nuevaImagenUrl = '';
    this.errorUrl = '';
    this.modalService.open('modalImagenes');
  }

  private esUrlValida(url: string): boolean {
    try {
      const u = new URL(url);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }

  anadirImagen() {
    if (!this.estacionImagenes) return;

    if (!this.nuevaImagenUrl.trim()) {
      this.errorUrl = 'Introduce una URL';
      return;
    }
    if (!this.esUrlValida(this.nuevaImagenUrl)) {
      this.errorUrl = 'La URL no es válida';
      return;
    }
    this.errorUrl = '';

    this.imagenService.addImagen(this.estacionImagenes.id, this.nuevaImagenUrl).subscribe({
      next: () => {
        this.nuevaImagenUrl = '';
        this.notificationService.exito('Imagen añadida correctamente');
        this.estacionService.getEstacionById(this.estacionImagenes!.id).subscribe({
          next: data => {
            this.estacionImagenes = data;
            this.cargarEstaciones();
          }
        });
      },
      error: () => this.notificationService.error('Error al añadir la imagen')
    });
  }

  eliminarImagen(imagenId: number) {
    this.imagenService.deleteImagen(imagenId).subscribe({
      next: () => {
        this.notificationService.exito('Imagen eliminada');
        this.estacionService.getEstacionById(this.estacionImagenes!.id).subscribe({
          next: data => {
            this.estacionImagenes = data;
            this.cargarEstaciones();
          }
        });
      },
      error: () => this.notificationService.error('Error al eliminar la imagen')
    });
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  subirArchivo() {
    if (!this.estacionImagenes || !this.archivoSeleccionado) return;
    this.imagenService.uploadImagen(this.estacionImagenes.id, this.archivoSeleccionado).subscribe({
      next: () => {
        this.archivoSeleccionado = null;
        this.notificationService.exito('Imagen subida correctamente');
        this.estacionService.getEstacionById(this.estacionImagenes!.id).subscribe({
          next: data => {
            this.estacionImagenes = data;
            this.cargarEstaciones();
          }
        });
      },
      error: () => this.notificationService.error('Error al subir la imagen')
    });
  }
}
