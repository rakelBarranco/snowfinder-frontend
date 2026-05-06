import {Component, inject, OnInit} from '@angular/core';
import {Estacion, Meteo, Opinion} from '../../interfaces/interfaz-estacion';
import {EstacionService} from '../../services/estacion-service';
import {ActivatedRoute} from '@angular/router';
import * as L from 'leaflet';
import {MeteoService} from '../../services/meteo-service';
import {AuthService} from '../../services/auth-service';
import {FavoritoService} from '../../services/favorito-service';
import {OpinionService} from '../../services/opinion-service';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';



@Component({
  selector: 'app-estacion-detalle-page',
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './estacion-detalle-page.html',
  styleUrl: './estacion-detalle-page.css',
})
export default class EstacionDetallePage implements OnInit {

  private route = inject(ActivatedRoute);
  private estacionService = inject(EstacionService);
  private meteoService = inject(MeteoService);
  private favoritoService = inject(FavoritoService);
  private opinionService = inject(OpinionService);
  private authService = inject(AuthService);


  estacion: Estacion | null = null;
  meteo: Meteo | null = null;
  opiniones: Opinion[] = [];
  esFavorito = false;
  loading = true;
  private mapaInicializado = false;

  nuevaPuntuacion = 5;
  nuevoComentario = '';

  ngOnInit() {
    this.getEstacionById();
  }

  getEstacionById() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.estacionService.getEstacionById(id).subscribe({
      next: data => {
        this.estacion = data;
        this.loading = false;
        this.meteoService.getMeteo(data.latitud, data.longitud).subscribe({
          next: meteo => this.meteo = meteo,
          error: err => console.error(err)
        });
        this.cargarOpiniones(data.id);
        if (this.authService.isLoggedIn()) {
          this.checkFavorito();
        }
        setTimeout(() => this.initMapa(), 0);
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  cargarOpiniones(estacionId: number) {
    this.opinionService.getOpinionesByEstacion(estacionId).subscribe({
      next: data => this.opiniones = data,
      error: err => console.error(err)
    });
  }

  enviarOpinion() {
    if (!this.estacion) return;
    this.opinionService.addOpinion(this.estacion.id, this.nuevaPuntuacion, this.nuevoComentario).subscribe({
      next: () => {
        this.nuevoComentario = '';
        this.nuevaPuntuacion = 5;
        this.cargarOpiniones(this.estacion!.id);
      },
      error: err => console.error(err)
    });
  }

  checkFavorito() {
    this.favoritoService.getMisFavoritos().subscribe({
      next: favoritos => {
        this.esFavorito = favoritos.some(f => f.id === this.estacion?.id);
      }
    });
  }

  toggleFavorito() {
    if (!this.estacion) return;
    if (this.esFavorito) {
      this.favoritoService.removeFavorito(this.estacion.id).subscribe({
        next: () => this.esFavorito = false
      });
    } else {
      this.favoritoService.addFavorito(this.estacion.id).subscribe({
        next: () => this.esFavorito = true
      });
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }


  initMapa() {
    if (!this.estacion || this.mapaInicializado) return;
    const contenedor = document.getElementById('mapa');
    if (!contenedor) return;
    this.mapaInicializado = true;
    const mapa = L.map('mapa').setView(
      [this.estacion.latitud, this.estacion.longitud], 12
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapa);
    L.marker([this.estacion.latitud, this.estacion.longitud])
      .addTo(mapa)
      .bindPopup(`<b>${this.estacion.nombre}</b>`)
      .openPopup();
  }
}
