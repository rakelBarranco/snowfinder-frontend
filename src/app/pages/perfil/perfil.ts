import {Component, inject, OnInit} from '@angular/core';
import {Estacion} from '../../interfaces/interfaz-estacion';
import {AuthService} from '../../services/auth-service';
import {FavoritoService} from '../../services/favorito-service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [
    RouterLink
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export default class Perfil implements OnInit {

  private authService = inject(AuthService);
  private favoritoService = inject(FavoritoService);

  usuario: any = null;
  favoritos: Estacion[] = [];
  loading = true;

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
  }

}
