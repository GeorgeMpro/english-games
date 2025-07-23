import {signal, WritableSignal} from '@angular/core';
import {WordItem} from '../../../data-access/api.models';
import {MatchItem} from '../../../shared/models/kids.models';
import {DEFAULT_STAGE_COUNT} from '../../../shared/game-config.constants';

export abstract class AbstractGameStore {

  /** The list of words for the currently selected category. */
  readonly wordsFromChosenCategories: WritableSignal<WordItem[]> = signal([]);

  /** The full set of word-image pairs retrieved from Wiki API. */
  readonly items: WritableSignal<MatchItem[]> = signal([]);

  /** The current shuffled slice of items used for the current gameplay. */
  readonly shuffledItemsSlice: WritableSignal<MatchItem[]> = signal([]);

  /** Items divided into stages; each stage is an array of match items. */
  readonly stageItems: WritableSignal<MatchItem[][]> = signal([]);

  /** The index of the current stage in the game. */
  readonly currentStage: WritableSignal<number> = signal(0);

  readonly gameOver: WritableSignal<boolean> = signal(false);

  progressStage(): void {

    const hasFinishedFinalStage = this.currentStage() === DEFAULT_STAGE_COUNT - 1;
    if (hasFinishedFinalStage) {
      this.gameOver.set(true);
      return;
    }

    this.currentStage.update(stage => stage + 1);
  }
}
