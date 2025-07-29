import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {ImageCard, MatchAttempt, MatchItem, WordCard} from '../../../shared/models/kids.models';
import {WordItem} from '../../../data-access/api.models';
import {AbstractGameStore} from '../shared/abstract-game.store';

/**
 * Central reactive store for Match Words game state.
 * Provides signals for selected cards, match items, and feedback message.
 * This class is UI-agnostic and suitable for testing and composition.
 */
@Injectable({providedIn: 'root'})
export class MatchWordsStore extends AbstractGameStore {



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
