import {Component, inject} from '@angular/core';
import {AuthService} from '../../../services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-registro-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './registro-page.html',
  styleUrl: './registro-page.css',
})
export default class RegistroPage {

  private authService = inject(AuthService);
  private router = inject(Router);

  nombre = '';
  email = '';
  password = '';
  error = '';
  loading = false;
  mostrarPassword = false;

  errores = { nombre: '', email: '', password: '' };

  private validar(): boolean {
    this.errores = { nombre: '', email: '', password: '' };

    if (!this.nombre.trim())
      this.errores.nombre = 'El nombre es obligatorio';

    if (!this.email.trim())
      this.errores.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
      this.errores.email = 'Introduce un email válido';

    if (!this.password)
      this.errores.password = 'La contraseña es obligatoria';
    else if (this.password.length < 6)
      this.errores.password = 'Mínimo 6 caracteres';

    return !this.errores.nombre && !this.errores.email && !this.errores.password;
  }

  register() {
    if (!this.validar()) return;

    this.loading = true;
    this.error = '';

    this.authService.register(this.nombre, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.error = 'Error al registrarse, prueba con otro email';
        this.loading = false;
      }
    });
  }
}
