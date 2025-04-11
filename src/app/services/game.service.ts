// src/app/services/game.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card } from '../models/card';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Definimos las cartas que tendrá el juego
  private cardSymbols: string[] = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍓', '🍑', '🍊'];
  
  // Observables para los datos del juego
  private cardsSubject = new BehaviorSubject<Card[]>([]);
  private playersSubject = new BehaviorSubject<Player[]>([]);
  private currentPlayerSubject = new BehaviorSubject<number>(0);
  private gameStartedSubject = new BehaviorSubject<boolean>(false);
  
  // Propiedades para el manejo del juego
  private selectedCards: Card[] = [];
  
  // Observables públicos
  cards$ = this.cardsSubject.asObservable();
  players$ = this.playersSubject.asObservable();
  currentPlayer$ = this.currentPlayerSubject.asObservable();
  gameStarted$ = this.gameStartedSubject.asObservable();
  
  constructor() { }
  
  // Iniciar el juego con los jugadores registrados
  startGame(players: string[]): void {
    // Configurar jugadores
    const gamePlayers: Player[] = players.map((name, index) => ({
      name,
      score: 0,
      turn: index === 0 // El primer jugador comienza
    }));
    
    this.playersSubject.next(gamePlayers);
    this.currentPlayerSubject.next(0);
    
    // Crear y mezclar las cartas
    this.initializeCards();
    
    // Marcar que el juego ha comenzado
    this.gameStartedSubject.next(true);
  }
  
  // Inicializar y mezclar las cartas
  private initializeCards(): void {
    // Duplicamos los símbolos para crear pares
    const allSymbols = [...this.cardSymbols, ...this.cardSymbols];
    
    // Crear cartas con los símbolos
    let cards: Card[] = allSymbols.map((symbol, index) => ({
      id: index,
      value: symbol,
      flipped: false,
      matched: false
    }));
    
    // Mezclar las cartas
    cards = this.shuffleCards(cards);
    
    this.cardsSubject.next(cards);
    this.selectedCards = [];
  }
  
  // Mezclar las cartas (algoritmo Fisher-Yates)
  private shuffleCards(cards: Card[]): Card[] {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  // Voltear una carta cuando el jugador la selecciona
  flipCard(cardId: number): void {
    if (this.selectedCards.length >= 2) return; // No permitir voltear más de 2 cartas
    
    const currentCards = this.cardsSubject.value;
    const cardIndex = currentCards.findIndex(card => card.id === cardId);
    
    // Verificar si la carta ya está volteada o emparejada
    if (cardIndex === -1 || currentCards[cardIndex].flipped || currentCards[cardIndex].matched) {
      return;
    }
    
    // Voltear la carta
    const updatedCards = [...currentCards];
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      flipped: true
    };
    
    this.cardsSubject.next(updatedCards);
    this.selectedCards.push(updatedCards[cardIndex]);
    
    // Si ya hay dos cartas volteadas, verificar si hay coincidencia
    if (this.selectedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 1000);
    }
  }
  
  // Verificar si las dos cartas volteadas coinciden
  private checkMatch(): void {
    const currentCards = this.cardsSubject.value;
    const currentPlayers = this.playersSubject.value;
    const currentPlayerIndex = this.currentPlayerSubject.value;
    
    const [card1, card2] = this.selectedCards;
    let isMatch = card1.value === card2.value;
    
    // Actualizar cartas basado en la coincidencia
    const updatedCards = currentCards.map(card => {
      if (card.id === card1.id || card.id === card2.id) {
        return {
          ...card,
          flipped: isMatch, // Las cartas permanecen volteadas si coinciden
          matched: isMatch  // Marcar como emparejadas si coinciden
        };
      }
      return card;
    });
    
    // Actualizar puntuación si hay coincidencia
    if (isMatch) {
      const updatedPlayers = [...currentPlayers];
      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        score: updatedPlayers[currentPlayerIndex].score + 1
      };
      this.playersSubject.next(updatedPlayers);
    } else {
      // Si no hay coincidencia, cambiar de turno en caso de 2 jugadores
      if (currentPlayers.length > 1) {
        const nextPlayerIndex = (currentPlayerIndex + 1) % currentPlayers.length;
        
        const updatedPlayers = currentPlayers.map((player, index) => ({
          ...player,
          turn: index === nextPlayerIndex
        }));
        
        this.playersSubject.next(updatedPlayers);
        this.currentPlayerSubject.next(nextPlayerIndex);
      }
    }
    
    this.cardsSubject.next(updatedCards);
    this.selectedCards = [];
    
    // Verificar si el juego ha terminado
    if (updatedCards.every(card => card.matched)) {
      setTimeout(() => {
        alert('¡Juego terminado!');
        // Aquí mostrar un resumen o reiniciar el juego
      }, 500);
    }
  }
  
  // Reiniciar el juego
  resetGame(): void {
    this.gameStartedSubject.next(false);
    this.playersSubject.next([]);
    this.cardsSubject.next([]);
    this.currentPlayerSubject.next(0);
    this.selectedCards = [];
  }
}