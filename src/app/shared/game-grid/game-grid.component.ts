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
  templateUrl: './game-grid.component.html',
  styleUrl: './game-grid.component.css'
})
export class GameGridComponent {
  cards = input<GameCardDefinition[]>([]);
}
