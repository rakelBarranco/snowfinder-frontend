import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registro-page.html',
  styleUrl: './registro-page.css',
})
export default class RegistroPage {

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  error = '';
  loading = false;
  mostrarPassword = false;

  form = this.fb.group({
    nombre:   ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get nombre()   { return this.form.get('nombre')!; }
  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  register() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.register(this.nombre.value!, this.email.value!, this.password.value!).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        this.error = 'Error al registrarse, prueba con otro email';
        this.loading = false;
      }
    });
  }
}
