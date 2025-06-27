import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidaUsuarioService } from '../services/partida-usuario.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss'
})
export class EstadisticasComponent implements OnInit {
  aciertos: any[] = [];

  constructor(private partidaUsuarioService: PartidaUsuarioService) {}

  ngOnInit(): void {
    this.partidaUsuarioService.obtenerAciertos().subscribe({
      next: (data) => {
        this.aciertos = data;
      },
      error: (err) => {
        console.error('Error al obtener estadísticas:', err);
      }
    });
  }
}
