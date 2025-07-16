import {Component, input, output} from '@angular/core';
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
      (click)="onClick()">
      <div class="icon">{{ card()?.icon }}</div>
      <div class="label">{{ card()?.label }}</div>
    </button>`,
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent {
  selected =output<void>();
  card = input<GameCardDefinition>();

  onClick() {
    this.selected.emit();
  }
}
