import {Component, inject, OnInit} from '@angular/core';
import {Estacion} from '../../../../interfaces/interfaz-estacion';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {EstacionService} from '../../../../services/estacion-service';
import {ImagenService} from '../../../../services/imagen-service';
import {NotificationService} from '../../../../services/notification-service';
import {ModalService} from '../../../../services/modal-service';

@Component({
  selector: 'app-admin-estaciones',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './admin-estaciones.html',
  styleUrl: './admin-estaciones.css',
})

export class AdminEstaciones implements OnInit {

  private estacionService = inject(EstacionService);
  private imagenService = inject(ImagenService);
  private notificationService = inject(NotificationService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  estaciones: Estacion[] = [];
  loading = true;
  estacionAEliminar: number | null = null;
  estacionImagenes: Estacion | null = null;
  archivoSeleccionado: File | null = null;
  editandoId: number | null = null;

  estacionForm: FormGroup = this.fb.group({
    nombre:      ['', [Validators.required, Validators.minLength(2)]],
    pais:        ['', Validators.required],
    kmPistas:    [null, [Validators.required, Validators.min(1)]],
    altitud:     [null, [Validators.required, Validators.min(1)]],
    latitud:     [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitud:    [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
    descripcion: ['', Validators.required],
    webcamUrl: ['']
  });

  urlForm: FormGroup = this.fb.group({
    url: ['', [Validators.required, Validators.pattern('https?://.+')]]
  });

  ngOnInit() {
    this.cargarEstaciones();
  }

  cargarEstaciones() {
    this.loading = true;
    this.estacionService.getEstaciones().subscribe({
      next: data => { this.estaciones = data; this.loading = false; },
      error: () => { this.notificationService.error('Error al cargar las estaciones'); this.loading = false; }
    });
  }

  abrirModalNueva() {
    this.editandoId = null;
    this.estacionForm.reset();
    this.modalService.open('modalEstacion');
  }

  abrirModalEdicion(estacion: Estacion) {
    this.editandoId = estacion.id;
    this.estacionForm.patchValue({
      nombre:      estacion.nombre,
      pais:        estacion.pais,
      kmPistas:    estacion.kmPistas,
      altitud:     estacion.altitud,
      latitud:     estacion.latitud,
      longitud:    estacion.longitud,
      descripcion: estacion.descripcion,
      webcamUrl: estacion.webcamUrl || ''
    });
    this.modalService.open('modalEstacion');
  }

  guardarEstacion() {
    if (this.estacionForm.invalid) {
      this.estacionForm.markAllAsTouched();
      return;
    }

    const datos = this.estacionForm.value as Estacion;

    if (this.editandoId) {
      this.estacionService.updateEstacion(this.editandoId, datos).subscribe({
        next: () => {
          this.modalService.close('modalEstacion');
          this.cargarEstaciones();
          this.notificationService.exito('Estación actualizada correctamente');
        },
        error: () => this.notificationService.error('Error al actualizar la estación')
      });
    } else {
      this.estacionService.createEstacion(datos).subscribe({
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
    this.urlForm.reset();
    this.modalService.open('modalImagenes');
  }

  anadirImagen() {
    if (this.urlForm.invalid) { this.urlForm.markAllAsTouched(); return; }

    this.imagenService.addImagen(this.estacionImagenes!.id, this.urlForm.value.url).subscribe({
      next: () => {
        this.urlForm.reset();
        this.notificationService.exito('Imagen añadida correctamente');
        this.refrescarImagenes();
      },
      error: () => this.notificationService.error('Error al añadir la imagen')
    });
  }

  eliminarImagen(imagenId: number) {
    this.imagenService.deleteImagen(imagenId).subscribe({
      next: () => {
        this.notificationService.exito('Imagen eliminada');
        this.refrescarImagenes();
      },
      error: () => this.notificationService.error('Error al eliminar la imagen')
    });
  }

  private refrescarImagenes() {
    this.estacionService.getEstacionById(this.estacionImagenes!.id).subscribe({
      next: data => { this.estacionImagenes = data; this.cargarEstaciones(); }
    });
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) this.archivoSeleccionado = input.files[0];
  }

  subirArchivo() {
    if (!this.estacionImagenes || !this.archivoSeleccionado) return;
    this.imagenService.uploadImagen(this.estacionImagenes.id, this.archivoSeleccionado).subscribe({
      next: () => {
        this.archivoSeleccionado = null;
        this.notificationService.exito('Imagen subida correctamente');
        this.refrescarImagenes();
      },
      error: () => this.notificationService.error('Error al subir la imagen')
    });
  }

  isInvalid(campo: string): boolean {
    const control = this.estacionForm.get(campo);
    return !!(control?.invalid && control?.touched);
  }
}
