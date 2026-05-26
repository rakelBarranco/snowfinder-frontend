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

  editandoNombre = false;
  nuevoNombre = '';
  errorNombre = '';

  editandoPassword = false;
  passwordActual = '';
  passwordNueva = '';
  passwordConfirm = '';
  erroresPassword = { actual: '', nueva: '', confirm: '' };

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
    this.errorNombre = '';
    if (!this.nuevoNombre.trim()) {
      this.errorNombre = 'El nombre no puede estar vacío';
      return;
    }
    this.authService.actualizarNombre(this.nuevoNombre).subscribe({
      next: () => {
        this.usuario.nombre = this.nuevoNombre;
        localStorage.setItem('nombre', this.nuevoNombre);
        this.editandoNombre = false;
        this.nuevoNombre = '';
        this.notificationService.exito('Nombre actualizado correctamente');
      },
      error: () => this.notificationService.error('Error al actualizar el nombre')
    });
  }

  private validarPassword(): boolean {
    this.erroresPassword = { actual: '', nueva: '', confirm: '' };

    if (!this.passwordActual)
      this.erroresPassword.actual = 'Introduce tu contraseña actual';

    if (!this.passwordNueva)
      this.erroresPassword.nueva = 'Introduce la nueva contraseña';
    else if (this.passwordNueva.length < 6)
      this.erroresPassword.nueva = 'Mínimo 6 caracteres';

    if (!this.passwordConfirm)
      this.erroresPassword.confirm = 'Confirma la nueva contraseña';
    else if (this.passwordNueva !== this.passwordConfirm)
      this.erroresPassword.confirm = 'Las contraseñas no coinciden';

    return !this.erroresPassword.actual && !this.erroresPassword.nueva && !this.erroresPassword.confirm;
  }

  guardarPassword() {
    if (!this.validarPassword()) return;

    this.authService.cambiarPassword(this.passwordActual, this.passwordNueva).subscribe({
      next: () => {
        this.editandoPassword = false;
        this.passwordActual = '';
        this.passwordNueva = '';
        this.passwordConfirm = '';
        this.erroresPassword = { actual: '', nueva: '', confirm: '' };
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
