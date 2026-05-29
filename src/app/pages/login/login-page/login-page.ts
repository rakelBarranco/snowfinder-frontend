import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export default class LoginPage {

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  error = '';
  loading = false;
  mostrarPassword = false;

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  login() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.email.value!, this.password.value!).subscribe({
      next: data => {
        this.authService.guardarToken(data.token, data.rol, data.nombre);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.error = 'Email o contraseña incorrectos';
        this.loading = false;
      }
    });
  }
}
