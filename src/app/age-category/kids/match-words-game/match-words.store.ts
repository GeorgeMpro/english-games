import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {ImageCard, MatchItem, WordCard} from '../../../shared/models/kids.models';


/**
 * Central reactive store for Match Words game state.
 * Provides signals for selected cards, match items, and feedback message.
 * This class is UI-agnostic and suitable for testing and composition.
 */
@Injectable({providedIn: 'root'})
export class MatchWordsStore {
  /** The full set of word-image pairs retrieved from Wiki API. */
  readonly items: WritableSignal<MatchItem[]> = signal([]);

  /** The list of words prepared as cards (shuffled). */
  readonly words: WritableSignal<WordCard[]> = signal([]);

  /** The list of images prepared as cards (shuffled). */
  readonly images: WritableSignal<ImageCard[]> = signal([]);

  /** Currently selected word ID. */
  readonly selectedWordId = signal<number | undefined>(undefined);

  /** Currently selected image ID. */
  readonly selectedImageId = signal<number | undefined>(undefined);

  /** Feedback message after a match attempt. */
  readonly message: WritableSignal<string> = signal('');

  /** Whether both a word and image are currently selected. */
  readonly isReadyToMatch = computed(() =>
    this.selectedWordId() != null && this.selectedImageId() != null
  );

  /** Resets selections and clears feedback. */
  resetSelections(): void {
    this.selectedWordId.set(undefined);
    this.selectedImageId.set(undefined);
    this.message.set('');
  }

}
