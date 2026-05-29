import {Component, inject, OnInit} from '@angular/core';
import {EstacionService} from '../../../services/estacion-service';
import {Estacion} from '../../../interfaces/interfaz-estacion';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {EstacionCardComponent} from '../../../components/estacion-card/estacion-card.component';

@Component({
  selector: 'app-estaciones-page',
  imports: [FormsModule, EstacionCardComponent],
  templateUrl: './estaciones-page.html',
  styleUrl: './estaciones-page.css',
})
export default class EstacionesPage implements OnInit {

  private estacionService = inject(EstacionService);

  todasEstaciones: Estacion[] = [];
  estaciones: Estacion[] = [];
  loading = true;
  busqueda = '';
  paisSeleccionado = '';
  paginaActual = 1;
  estacionesPorPagina = 9;

  get estacionesPaginadas(): Estacion[] {
    const inicio = (this.paginaActual - 1) * this.estacionesPorPagina;
    return this.estaciones.slice(inicio, inicio + this.estacionesPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.estaciones.length / this.estacionesPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get paises(): string[] {
    return [...new Set(this.todasEstaciones.map(e => e.pais))].sort();
  }

  ngOnInit() {
    this.getEstaciones();
  }

  getEstaciones() {
    this.estacionService.getEstaciones().subscribe({
      next: data => {
        this.todasEstaciones = data;
        this.estaciones = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  filtrar() {
    this.paginaActual = 1;
    this.estaciones = this.todasEstaciones.filter(e => {
      const coincideNombre = e.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincidePais = this.paisSeleccionado ? e.pais === this.paisSeleccionado : true;
      return coincideNombre && coincidePais;
    });
  }

  limpiarFiltros() {
    this.paginaActual = 1;
    this.busqueda = '';
    this.paisSeleccionado = '';
    this.estaciones = this.todasEstaciones;
  }

}
