import {Component, inject, OnInit} from '@angular/core';
import {EstacionService} from '../../../services/estacion-service';
import {Estacion} from '../../../interfaces/interfaz-estacion';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-estaciones-page',
  imports: [
    RouterLink
  ],
  templateUrl: './estaciones-page.html',
  styleUrl: './estaciones-page.css',
})
export default class EstacionesPage implements OnInit {

  private estacionService = inject(EstacionService);
  estaciones: Estacion[] = [];
  loading = true;

  ngOnInit() {
    this.getEstaciones();
  }

  getEstaciones() {
    this.estacionService.getEstaciones().subscribe({
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

}
