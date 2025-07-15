import {Component, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {GameCardDefinition} from '../game-grid/game-grid.component';

@Component({
  selector: 'app-game-card',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <button
      class="game-card"
      [routerLink]="card()?.link"
      routerLinkActive="active"
      [routerLinkActiveOptions]="{ exact: true }"
    >
      <div class="icon">{{ card()?.icon }}</div>
      <div class="label">{{ card()?.label }}</div>
    </button>`,
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent {
  card = input<GameCardDefinition>();
}
