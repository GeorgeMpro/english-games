import {Component, effect, OnInit, signal, WritableSignal} from '@angular/core';

import {SoundService} from '../shared/services/sound.service';
import {MatchSoundsWordsService} from '../shared/services/match-sounds-words.service';
import {MatchItem} from '../../../shared/models/kids.models';

@Component({
  selector: 'app-match-sounds-game',
  imports: [],
  templateUrl: './match-sounds-game.component.html',
  styleUrl: './match-sounds-game.component.scss'
})
export class MatchSoundsGameComponent implements OnInit {
  isSelectorOpen: any;
  readonly currentWord = signal('');
  readonly currentItems: WritableSignal<MatchItem[]> = signal([]);

  constructor(private soundService: SoundService,
              private matchSoundsService: MatchSoundsWordsService) {
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
}
