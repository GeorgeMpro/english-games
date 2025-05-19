import {Injectable} from '@angular/core';
import {ImageCard, MatchAttempt, MatchItem, WordCard} from '../models/kids.models';


@Injectable({providedIn: 'root'})
export class GameLogicService {

  // todo update? to take or return parts of the array
  // todo maybe change the order of creation?
  setupCards(items: MatchItem[]): {
    words: WordCard[],
    images: ImageCard[]
  } {
    return {
      words: this.createWordCards(items),
      images: this.createImageCards(items)
    };
  }

  private createWordCards(items: MatchItem[]): WordCard[] {
    return this.shuffle(
      items.map(item => ({
        id: item.id,
        text: item.word,
        matched: item.matched
      }))
    );
  }

  private createImageCards(items: MatchItem[]): ImageCard[] {
    return this.shuffle(
      items.map(item => ({
        id: item.id,
        url: item.imageUrl,
        text: item.word,
        matched: item.matched
      }))
    );
  }

  // todo cleanup
  // fisher yates shuffle
  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  markMatched<T extends { id: number; matched: boolean }>(cards: T[], id: number): T[] {
    return cards.map(card => card.id === id ? {...card, matched: true} : card);
  }

  tryMatchResult(
    wordId: number | undefined,
    imageId: number | undefined,
    words: WordCard[],
    images: ImageCard[]
  ): { updatedWords: WordCard[]; updatedImages: ImageCard[]; message: string } | null {
    if (wordId == null || imageId == null) {
      return null;
    }

    const isCorrect = wordId === imageId;

    return {
      updatedWords: isCorrect ? this.markMatched(words, wordId) : words,
      updatedImages: isCorrect ? this.markMatched(images, wordId) : images,
      message: this.setCardMatchFeedback(isCorrect)
    };
  }

  setCardMatchFeedback(isCorrect: boolean): string {
    return isCorrect ? '✅ Correct!' : '❌ Try again.';
  }

  // todo test?
  generateItemSlicesForEachStage(items: MatchItem[], stages: number, itemsPerStage: number): MatchItem[][] {
    const result: MatchItem[][] = [];
    for (let i = 0; i < stages; i++) {
      const start = i * itemsPerStage;
      const end = start + itemsPerStage;
      result.push(items.slice(start, end));
    }

    return result;
  }

  generateShuffledItemCopy(items: MatchItem[]): MatchItem[] {
    const copy = [...items];
    return this.shuffle(copy);
  }


  /**
   * Updates the match attempts map with the given word and image IDs.
   *
   * - Increments the attempt count for the image ID.
   * - Marks whether the match was correct on the first attempt.
   *
   * @param wordId - The selected word card ID.
   * @param imageId - The selected image card ID.
   * @param prev - The previous match attempts map.
   * @returns A new map containing the updated match attempt.
   */
  updateMatchAttempts(
    wordId: number,
    imageId: number,
    prev: Map<number, {
      attempts: number,
      correctOnFirstTry: boolean
    }>): Map<number, MatchAttempt> {
    const newMap: Map<number, MatchAttempt> = new Map(prev);
    const exist = newMap.get(imageId);
    const isFirstAttempt = !exist;
    const isCorrect = imageId === wordId;

    newMap.set(imageId, {
      attempts: (exist?.attempts ?? 0) + 1,
      correctOnFirstTry: isFirstAttempt && isCorrect
    });

    return newMap;
  }
}

