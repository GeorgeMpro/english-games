import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {GameCardDefinition, GameGridComponent} from '../../shared/game-grid/game-grid.component';

@Component({
  selector: 'app-kids',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    GameGridComponent,

  ],
  templateUrl: './kids.component.html',
  styleUrl: './kids.component.css'
})
export class KidsComponent {
  private readonly gameCards: GameCardDefinition[] = [
    {icon: '🔤', label: 'Match Words', link: 'match-words'},
    {icon: '🔊', label: 'Match Sounds', link: 'match-sounds'},
    {icon: '🎧', label: 'Write by Sound', link: 'write-by-sound'}
  ];
}
