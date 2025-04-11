// src/app/components/game-board/game-board.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { GameService } from '../../services/game.service';
import { Card } from '../../models/card';
import { Player } from '../../models/player';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit {
  cards$!: Observable<Card[]>;
  players$!: Observable<Player[]>;
  currentPlayer$!: Observable<number>;
  
  constructor(private gameService: GameService) { }
  
  ngOnInit(): void {
    this.cards$ = this.gameService.cards$;
    this.players$ = this.gameService.players$;
    this.currentPlayer$ = this.gameService.currentPlayer$;
  }
  
  onCardClick(cardId: number): void {
    this.gameService.flipCard(cardId);
  }
  
  resetGame(): void {
    if (confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
      this.gameService.resetGame();
    }
  }
}