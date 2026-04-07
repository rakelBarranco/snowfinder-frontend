import {Component, inject} from '@angular/core';
import {AuthService} from '../../../services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export default class LoginPage {

  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  loading = false;

  login() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: data => {
        this.authService.guardarToken(data.token, data.rol, data.nombre);
        this.router.navigate(['/home']);
      },
      error: err => {
        this.error = 'Email o contraseña incorrectos';
        this.loading = false;
      }
    });
  }

}
