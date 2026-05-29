import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estacion-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './estacion-card.component.html',
  styleUrl: './estacion-card.component.css'
})
export class EstacionCardComponent {
  @Input() estacion!: any;
  @Input() mostrarEliminar = false;
  @Output() eliminar = new EventEmitter<number>();
}
