import {Component} from '@angular/core';
import {AdminEstaciones} from '../components/admin-estaciones/admin-estaciones';
import {AdminOpiniones} from '../components/admin-opiniones/admin-opiniones';


@Component({
  selector: 'app-admin-page',
  imports: [AdminEstaciones, AdminOpiniones],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.css',
})
export default class AdminPage {
  pestanaActiva: 'estaciones' | 'opiniones' = 'estaciones';

  cambiarPestana(pestana: 'estaciones' | 'opiniones') {
    this.pestanaActiva = pestana;
  }
}
