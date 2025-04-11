// src/app/components/card/card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../models/card';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() card!: Card;
  @Output() cardClick = new EventEmitter<number>();

  onClick(): void {
    if (!this.card.flipped && !this.card.matched) {
      this.cardClick.emit(this.card.id);
    }
  }
}