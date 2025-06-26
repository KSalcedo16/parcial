// src/app/components/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameBoardComponent } from '../game-board/game-board.component';
import { GameService } from '../../services/game.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, GameBoardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  playerMode: 'single' | 'multi' = 'single';
  player1Name: string = '';
  player2Name: string = '';
  gameStarted: boolean = false;
  player1Email: string = '';
  player1Password: string = '';
  player2Email: string = '';
  player2Password: string = '';

  
constructor(
  private gameService: GameService,
  private usuarioService: UsuarioService
) {
  this.gameService.gameStarted$.subscribe(started => {
    this.gameStarted = started;
  });
}

startGame(): void {
  if (this.playerMode === 'single') {
    if (!this.player1Name.trim() || !this.player1Email.trim() || !this.player1Password.trim()) {
      alert('Completa todos los campos para el Jugador 1');
      return;
    }

    this.usuarioService.registrarUsuario(this.player1Name, this.player1Email, this.player1Password)
      .subscribe({
        next: () => {
          this.gameService.startGame([this.player1Name]);
        },
        error: () => {
          alert('Hubo un problema al registrar el jugador. Intenta nuevamente.');
        }
      });

  } else {
    if (
      !this.player1Name.trim() || !this.player1Email.trim() || !this.player1Password.trim() ||
      !this.player2Name.trim() || !this.player2Email.trim() || !this.player2Password.trim()
    ) {
      alert('Completa todos los campos para ambos jugadores');
      return;
    }

    // Registrar jugador 1
    this.usuarioService.registrarUsuario(this.player1Name, this.player1Email, this.player1Password).subscribe({
      next: () => {
        // Registrar jugador 2 después de que jugador 1 se registre
        this.usuarioService.registrarUsuario(this.player2Name, this.player2Email, this.player2Password).subscribe({
          next: () => {
            this.gameService.startGame([this.player1Name, this.player2Name]);
          },
          error: () => {
            alert('Error al registrar Jugador 2');
          }
        });
      },
      error: () => {
        alert('Error al registrar Jugador 1');
      }
    });
  }
}
}
