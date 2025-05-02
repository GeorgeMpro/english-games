import {Component, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {GameCardDefinition} from '../game-grid/game-grid.component';

@Component({
  selector: 'app-game-card',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css'
})
export class GameCardComponent {
  card = input<GameCardDefinition>();
}
