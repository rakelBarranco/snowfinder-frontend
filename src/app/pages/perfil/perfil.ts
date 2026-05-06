import {Component, inject, OnInit} from '@angular/core';
import {Estacion, Opinion} from '../../interfaces/interfaz-estacion';
import {AuthService} from '../../services/auth-service';
import {FavoritoService} from '../../services/favorito-service';
import {OpinionService} from '../../services/opinion-service';
import {NotificationService} from '../../services/notification-service';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-perfil',
  imports: [RouterLink, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export default class Perfil implements OnInit {

  private authService = inject(AuthService);
  private favoritoService = inject(FavoritoService);
  private opinionService = inject(OpinionService);
  private notificationService = inject(NotificationService);

  usuario: any = null;
  favoritos: Estacion[] = [];
  opiniones: Opinion[] = [];
  loading = true;
  opinionAEliminar: number | null = null;

  // Editar nombre
  editandoNombre = false;
  nuevoNombre = '';

  // Cambiar contraseña
  editandoPassword = false;
  passwordActual = '';
  passwordNueva = '';
  passwordConfirm = '';

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: data => {
        this.usuario = data;
        this.loading = false;
      },
      error: err => console.error(err)
    });

    this.favoritoService.getMisFavoritos().subscribe({
      next: data => this.favoritos = data,
      error: err => console.error(err)
    });

    this.opinionService.getMisOpiniones().subscribe({
      next: data => this.opiniones = data,
      error: err => console.error(err)
    });
  }

  eliminarOpinion(id: number) {
    this.opinionService.deleteOpinion(id).subscribe({
      next: () => {
        this.opiniones = this.opiniones.filter(o => o.id !== id);
        this.notificationService.exito('Opinión eliminada correctamente');
      },
      error: () => this.notificationService.error('Error al eliminar la opinión')
    });
  }

  abrirModal(id: number) {
    this.opinionAEliminar = id;
    const modal = document.getElementById('modalEliminar');
    if (modal) new (window as any).bootstrap.Modal(modal).show();
  }

  confirmarEliminar() {
    if (this.opinionAEliminar === null) return;
    this.eliminarOpinion(this.opinionAEliminar);
    this.opinionAEliminar = null;
    const modal = document.getElementById('modalEliminar');
    if (modal) (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

  guardarNombre() {
    if (!this.nuevoNombre.trim()) return;
    this.authService.actualizarNombre(this.nuevoNombre).subscribe({
      next: () => {
        this.usuario.nombre = this.nuevoNombre;
        localStorage.setItem('nombre', this.nuevoNombre);
        this.editandoNombre = false;
        this.notificationService.exito('Nombre actualizado correctamente');
      },
      error: () => this.notificationService.error('Error al actualizar el nombre')
    });
  }

  guardarPassword() {
    if (this.passwordNueva !== this.passwordConfirm) {
      this.notificationService.error('Las contraseñas no coinciden');
      return;
    }
    this.authService.cambiarPassword(this.passwordActual, this.passwordNueva).subscribe({
      next: () => {
        this.editandoPassword = false;
        this.passwordActual = '';
        this.passwordNueva = '';
        this.passwordConfirm = '';
        this.notificationService.exito('Contraseña actualizada correctamente');
      },
      error: () => this.notificationService.error('La contraseña actual no es correcta')
    });
  }

  confirmarEliminarCuenta() {
    this.authService.eliminarCuenta().subscribe({
      next: () => {
        this.authService.logout();
        window.location.href = '/home';
      },
      error: () => this.notificationService.error('Error al eliminar la cuenta')
    });
  }

  abrirModalEliminarCuenta() {
    const modal = document.getElementById('modalEliminarCuenta');
    if (modal) new (window as any).bootstrap.Modal(modal).show();
  }
}
