import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GameCardComponent} from '../game-card/game-card.component';

export interface GameCardDefinition {
  icon: string;
  label: string;
  link: string;
}

@Component({
  selector: 'app-game-grid',
  imports: [
    GameCardComponent,
    CommonModule,
  ],
  template: `
    <section class="games-grid">
      @for (card of cards(); track card) {
        <app-game-card [card]="card"></app-game-card>
      }
    </section>
  `,
  styleUrl: './game-grid.component.scss'
})
export class GameGridComponent {
  cards = input<GameCardDefinition[]>([]);
}
