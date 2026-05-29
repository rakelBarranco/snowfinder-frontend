import {Component, inject, OnInit} from '@angular/core';
import {OpinionService} from '../../../../services/opinion-service';
import {NotificationService} from '../../../../services/notification-service';
import {Opinion} from '../../../../interfaces/interfaz-estacion';


@Component({
  selector: 'app-admin-opiniones',
  imports: [],
  templateUrl: './admin-opiniones.html',
  styleUrl: './admin-opiniones.css',
})
export class AdminOpiniones implements OnInit {

  private opinionService = inject(OpinionService);
  private notificationService = inject(NotificationService);

  opiniones: Opinion[] = [];
  loading = true;

  ngOnInit() {
    this.cargarOpiniones();
  }

  cargarOpiniones() {
    this.loading = true;
    this.opinionService.getTodasOpiniones().subscribe({
      next: data => {
        this.opiniones = data;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Error al cargar las opiniones');
        this.loading = false;
      }
    });
  }

  eliminarOpinion(id: number) {
    this.opinionService.deleteOpinion(id).subscribe({
      next: () => {
        this.opiniones = this.opiniones.filter(o => o.id !== id);
        this.notificationService.exito('Opinión eliminada correctamente');
      },
      error: () => this.notificationService.error('Error al eliminar la opinión')
    });
  }
}
