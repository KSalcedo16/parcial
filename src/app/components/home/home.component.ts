// src/app/components/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameBoardComponent } from '../game-board/game-board.component';
import { GameService } from '../../services/game.service';

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
  
  constructor(private gameService: GameService) {
    this.gameService.gameStarted$.subscribe(started => {
      this.gameStarted = started;
    });
  }
  
  startGame(): void {
    // Validar que los nombres estén completos
    if (this.playerMode === 'single' && !this.player1Name.trim()) {
      alert('Por favor, ingresa tu nombre para comenzar');
      return;
    }
    
    if (this.playerMode === 'multi' && (!this.player1Name.trim() || !this.player2Name.trim())) {
      alert('Por favor, ingresa el nombre de ambos jugadores para comenzar');
      return;
    }
    
    // Iniciar el juego con los jugadores correspondientes
    const players = this.playerMode === 'single' 
      ? [this.player1Name]
      : [this.player1Name, this.player2Name];
      
    this.gameService.startGame(players);
  }
}