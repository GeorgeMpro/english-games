import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {ImageCard, MatchAttempt, MatchItem, WordCard} from '../../../shared/models/kids.models';
import {WordItem} from '../../../data-access/api.models';

/**
 * Central reactive store for Match Words game state.
 * Provides signals for selected cards, match items, and feedback message.
 * This class is UI-agnostic and suitable for testing and composition.
 */
@Injectable({providedIn: 'root'})
export class MatchWordsStore {
  /** The full set of word-image pairs retrieved from Wiki API. */
  readonly items: WritableSignal<MatchItem[]> = signal([]);

  /** The list of words for the currently selected category. */
  readonly wordsFromChosenCategories: WritableSignal<WordItem[]> = signal([]);

  /** The current shuffled slice of items used for the current gameplay. */
  readonly shuffledItemsSlice: WritableSignal<MatchItem[]> = signal([]);

  /** Items divided into stages; each stage is an array of match items. */
  readonly stageItems: WritableSignal<MatchItem[][]> = signal([]);

  /** The index of the current stage in the game. */
  readonly currentStage: WritableSignal<number> = signal(0);

  readonly gameOver: WritableSignal<boolean> = signal(false);

  /*Items for the current game stage*/
  readonly currentStageItems = computed(() =>
    this.stageItems()[this.currentStage()] ?? []
  );

  /*Counts unique first attempts to match word - image pair*/
  readonly uniqueCorrectMatchAttemptCounter = signal(new Map<number, MatchAttempt>());

  /** The list of words prepared as cards (shuffled). */
  readonly wordCards: WritableSignal<WordCard[]> = signal([]);

  /** The list of images prepared as cards (shuffled). */
  readonly imageCards: WritableSignal<ImageCard[]> = signal([]);

  /** Currently selected word ID. */
  readonly selectedWordId = signal<number | undefined>(undefined);

  /** Currently selected image ID. */
  readonly selectedImageId = signal<number | undefined>(undefined);

  /** Feedback message after a match attempt. */
  readonly matchAttemptMessage: WritableSignal<string> = signal('');

  /** Resets word, image, and message selections. */
  resetSelections(): void {
    this.selectedWordId.set(undefined);
    this.selectedImageId.set(undefined);
    this.matchAttemptMessage.set('');
  }
}
