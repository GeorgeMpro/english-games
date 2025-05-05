import {Injectable} from '@angular/core';
import {ImageCard, MatchItem, WordCard} from '../models/kids.models';


@Injectable({providedIn: 'root'})
export class GameSetupService {

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

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  setCardMatchFeedback(isCorrect: boolean): string {
    return isCorrect ? '✅ Correct!' : '❌ Try again.';
  }

  markMatched<T extends { id: number; matched: boolean }>(cards: T[], id: number): T[] {
    return cards.map(card => card.id === id ? {...card, matched: true} : card);
  }

  isReadyToMatch(wordId?: number, imageId?: number): boolean {
    return wordId != null && imageId != null;
  }

  isCorrectMatch(wordId?: number, imageId?: number): boolean {
    return wordId === imageId;
  }
}
