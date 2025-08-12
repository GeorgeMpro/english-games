import {Injectable, signal, WritableSignal} from '@angular/core';

import {AbstractGameStore} from '../shared/abstract-game.store';
import {MatchItem} from '../../../shared/models/kids.models';
import {DEFAULT_STAGE_COUNT} from '../../../shared/game-config.constants';

@Injectable({providedIn: 'root'})
export class MatchSoundsStore extends AbstractGameStore {

  readonly mainWords: WritableSignal<MatchItem[]> = signal<MatchItem[]>([]);

  readonly firstTryMatch: WritableSignal<number> = signal<number>(0);

  readonly attemptsThisStage: WritableSignal<number> = signal<number>(0);

  getCurrentMainWord(): MatchItem {
    return this.mainWords()[this.currentStage()];
  }

  isCorrectMatch(itemId: number): boolean {
    return itemId === this.getMainWordId();
  }

  getMainWordId(): number {
    return this.mainWords()[this.currentStage()].id;
  }

  matchMainWord(): void {
    const i = this.currentStage();
    const next = [...this.mainWords()];
    next[i] = {...next[i], matched: true};
    this.mainWords.set(next);
  }

  override progressStage(): void {
    if (this.isMatched()) {
      const isFirstTrySuccess = this.attemptsThisStage() === 1;
      if (isFirstTrySuccess) {
        this.firstTryMatch.update(currentCount => currentCount + 1);
      }
      this.resetStageAttempts();

      if (this.hasFinishedFinalStage()) {
        this.gameOver.set(true);
        return;
      }
      this.currentStage.update(stage => stage + 1);
    }
  }

  resetStageAttempts(): void {
    this.attemptsThisStage.set(0);
  }

  private hasFinishedFinalStage(): boolean {
    return this.currentStage() >= this.mainWords().length - 1;
  }

  private isMatched(): boolean {
    return this.getCurrentMainWord().matched;
  }

  incrementAttempts(): void {
    this.attemptsThisStage.update(attempts => attempts + 1);
  }

  reset() {
    // todo implement
  }


}

