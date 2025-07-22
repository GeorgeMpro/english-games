import {Component, signal} from '@angular/core';

import {SoundService} from '../shared/services/sound.service';

@Component({
  selector: 'app-match-sounds-game',
  imports: [],
  templateUrl: './match-sounds-game.component.html',
  styleUrl: './match-sounds-game.component.scss'
})
export class MatchSoundsGameComponent {
  isSelectorOpen: any;
  readonly currentWord = signal('Abominable Snowman');

  constructor(private soundService: SoundService) {

  }

  onPlay(): void {
    this.soundService.speak(this.currentWord());
  }

  onSlow(): void {
    this.soundService.speak(this.currentWord(), 0.5);
  }
}
