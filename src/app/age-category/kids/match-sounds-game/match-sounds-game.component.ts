import {Component, effect, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';

import {SoundService} from '../shared/services/sound.service';
import {MatchSoundsWordsService} from '../shared/services/match-sounds-words.service';
import {MatchItem} from '../../../shared/models/kids.models';
import {MatchSoundsStore} from './match-sounds.store';
import {EndGameModalComponent} from '../../../shared/components/end-game-modal/end-game-modal.component';
import {
  CategoryChooserModalComponent
} from '../../../shared/components/category-chooser-modal/category-chooser-modal.component';
import {WordGroup} from '../../../data-access/api.models';

@Component({
  selector: 'app-match-sounds-game',
  imports: [
    EndGameModalComponent,
    CategoryChooserModalComponent
  ],
  templateUrl: './match-sounds-game.component.html',
  styleUrl: './match-sounds-game.component.scss'
})
export class MatchSoundsGameComponent implements OnInit {
  isSelectorOpen: any;
  private readonly soundService = inject(SoundService);
  private readonly matchSoundsService = inject(MatchSoundsWordsService);
  private readonly store = inject(MatchSoundsStore);

  readonly gameOver = this.store.gameOver;

  // TODO just dummy below
  currentWord = signal('');
  readonly currentItems: WritableSignal<MatchItem[]> = signal([]);

  @ViewChild(CategoryChooserModalComponent) chooser!: CategoryChooserModalComponent;


  constructor() {
    effect(() => {
      // Notice: decided upon taking the first word in stage as main
      const chosenWordLoc = 0;
      const mainWord = this.matchSoundsService.getStore().mainWords()[chosenWordLoc];
      if (mainWord) this.currentWord.set(mainWord.word);

      this.currentItems.set(this.matchSoundsService.getCurrentStageItems());
    });
  }

  ngOnInit() {
    this.matchSoundsService.initializeGame(4);

  }

  onPlay(): void {
    this.soundService.speak(this.currentWord());
  }

  onSlow(): void {
    this.soundService.speak(this.currentWord(), 0.5);
  }

  newGame() {
    this.matchSoundsService.newGame();
  }

  replayGame() {
    this.matchSoundsService.replay();
  }

  openChooser() {
    this.chooser.open();
  }

  newCategoriesGame(categories: WordGroup[]) {

    this.matchSoundsService.newCategoriesGame(categories.map(c => c.id));

  }
}
