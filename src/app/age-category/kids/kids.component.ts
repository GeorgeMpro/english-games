import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {GameCardDefinition, GameGridComponent} from '../../shared/game-grid/game-grid.component';

@Component({
  selector: 'app-kids',
  imports: [
    RouterOutlet,
    GameGridComponent,
  ],
  templateUrl: './kids.component.html',
  styleUrl: './kids.component.css'
})
export class KidsComponent {
  readonly gameCards: GameCardDefinition[] = [
    {icon: '🔤', label: 'Match Words', link: 'match-words'},
    {icon: '🔊', label: 'Match Sounds', link: 'match-sounds'},
    {icon: '🎧', label: 'Write by Sound', link: 'write-by-sound'}
  ];
}
