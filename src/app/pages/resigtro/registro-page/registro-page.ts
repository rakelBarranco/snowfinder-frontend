import {Component, inject} from '@angular/core';
import {AuthService} from '../../../services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-registro-page',
  imports: [
    RouterLink,
    FormsModule
  ],
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

  register() {
    this.loading = true;
    this.error = '';

    this.authService.register(this.nombre, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: err => {
        this.error = 'Error al registrarse, prueba con otro email';
        this.loading = false;
      }
    });
  }

}
