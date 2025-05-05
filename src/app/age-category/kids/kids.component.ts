import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {GameCardDefinition, GameGridComponent} from '../../shared/components/game-grid/game-grid.component';
import {IframeModeDirective} from '../../shared/directives/iframe-mode/iframe-mode.directive';

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
  isEmbedded: boolean = IframeModeDirective.isEmbedded();
}
