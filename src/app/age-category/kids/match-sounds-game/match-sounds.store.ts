import {Injectable, signal, WritableSignal} from '@angular/core';

import {AbstractGameStore} from '../shared/abstract-game.store';
import {MatchItem} from '../../../shared/models/kids.models';
import {DEFAULT_STAGE_COUNT} from '../../../shared/game-config.constants';

@Injectable({providedIn: 'root'})
export class MatchSoundsStore extends AbstractGameStore {

  readonly mainWords: WritableSignal<MatchItem[]> = signal([]);

  getCurrentMainWord(): MatchItem {
    return this.mainWords()[this.currentStage()];
  }

  override progressStage() {
    const hasFinishedFinalStage = this.currentStage() === DEFAULT_STAGE_COUNT - 1;

    if (this.getCurrentMainWord().matched) {
      if (hasFinishedFinalStage) {
        this.gameOver.set(true);
        return;
      }
      this.currentStage.update(stage => stage + 1);
    }
  }

  reset() {
    // todo implement
  }
}

