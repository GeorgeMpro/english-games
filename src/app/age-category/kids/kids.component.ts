import {Component, signal} from '@angular/core';
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
        <button class="choose-category-button"
                (click)="isSelectorOpen.set(!isSelectorOpen())">
          <span>Select a Game</span>
        </button>
      </section>
    }
    @if (isSelectorOpen()) {
      <div class="app-modal" data-testid="game-selector-modal">
        <div class="modal-content">
          <app-game-grid [cards]="gameCards"
                         (cardSelected)="this.isSelectorOpen.set(false)"/>
          <button (click)="isSelectorOpen.set(false)">
            <span>Close</span>
          </button>
        </div>
      </div>
    }
    <router-outlet></router-outlet>
  `,
  styleUrls: [
    '../../../styles/components/modal.shared.scss',
    '../../../styles/components/_button.scss',
    './kids.component.scss'
  ]
})
export class KidsComponent {
  isSelectorOpen = signal<boolean>(false);
  readonly gameCards: GameCardDefinition[] = [
    {icon: '🔤', label: 'Match Words', link: 'match-words'},
    {icon: '🔊', label: 'Match Sounds', link: 'match-sounds'},
    {icon: '🎧', label: 'Write by Sound', link: 'write-by-sound'}
  ];
  isEmbedded: boolean = IframeModeDirective.isEmbedded();
}
