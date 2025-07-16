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
  template: `
    @if (!isEmbedded) {
      <section class="kids-games"
               data-testid="kids-games">
        <h2>Select a Game</h2>
        <app-game-grid [cards]="gameCards"/>
      </section>
    }
    <router-outlet></router-outlet>
  `,
  styles: `
    .kids-games {
      text-align: center;
    }

    .kids-games h2 {
      color: #4e54c8;
      margin-bottom: 1rem;
    }
  `
})
export class KidsComponent {
  readonly gameCards: GameCardDefinition[] = [
    {icon: '🔤', label: 'Match Words', link: 'match-words'},
    {icon: '🔊', label: 'Match Sounds', link: 'match-sounds'},
    {icon: '🎧', label: 'Write by Sound', link: 'write-by-sound'}
  ];
  isEmbedded: boolean = IframeModeDirective.isEmbedded();
}
