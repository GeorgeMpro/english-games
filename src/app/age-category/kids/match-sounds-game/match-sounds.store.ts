import {signal, WritableSignal} from '@angular/core';

import {AbstractGameStore} from '../shared/abstract-game.store';
import {MatchItem} from '../../../shared/models/kids.models';

export class MatchSoundsStore extends AbstractGameStore {

  readonly mainWords: WritableSignal<MatchItem[]> = signal([]);

  getCurrentMainWord(): MatchItem {
    return this.mainWords()[this.currentStage()];
  }
}

