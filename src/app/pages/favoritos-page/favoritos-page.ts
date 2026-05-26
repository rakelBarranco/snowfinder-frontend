import {Component, inject, OnInit} from '@angular/core';
import {FavoritoService} from '../../services/favorito-service';
import {NotificationService} from '../../services/notification-service';
import {Estacion} from '../../interfaces/interfaz-estacion';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-favoritos-page',
  imports: [RouterLink],
  templateUrl: './favoritos-page.html',
  styleUrl: './favoritos-page.css',
})
export default class FavoritosPage implements OnInit {

  private favoritoService = inject(FavoritoService);
  private notificationService = inject(NotificationService);

  estaciones: Estacion[] = [];
  loading = true;

  ngOnInit() {
    this.getFavoritos();
  }

  getFavoritos() {
    this.favoritoService.getMisFavoritos().subscribe({
      next: data => {
        this.estaciones = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  eliminarFavorito(estacionId: number) {
    this.favoritoService.removeFavorito(estacionId).subscribe({
      next: () => {
        this.estaciones = this.estaciones.filter(e => e.id !== estacionId);
        this.notificationService.exito('Eliminado de favoritos');
      },
      error: () => this.notificationService.error('Error al eliminar el favorito')
    });
  }
}
