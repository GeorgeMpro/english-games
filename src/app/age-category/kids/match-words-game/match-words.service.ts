import {Injectable} from '@angular/core';
import {Observable, switchMap, take} from 'rxjs';

import {GameSetupService} from '../../../shared/services/game-setup.service';
import {ImageCard, MatchItem, WordCard} from '../../../shared/models/kids.models';
import {WikiService} from '../../../shared/services/wiki.service';
import {Category, VocabularyService} from '../../../shared/services/vocabulary.service';
import {MatchWordsStore} from './match-words.store';

@Injectable({providedIn: 'root'})
export class MatchWordsService {
  constructor(
    private readonly store: MatchWordsStore,
    private readonly gameSetupService: GameSetupService,
    private readonly wikiService: WikiService,
    private readonly vocabularyService: VocabularyService
  ) {
  }

  setupGameItems(category: Category): void {
    this.fetchItemsByCategory(category).pipe(take(1)).subscribe({
        next: (items) => {
          this.store.items.set(items);
          this.setupGameCardsFromItems(items);
        },
        error: () => {
          // todo update message?
          this.store.message.set('⚠️ Failed to load items.');
        }
      }
    );
  }

  private fetchItemsByCategory(category: Category): Observable<MatchItem[]> {
    return this.vocabularyService.getList(category).pipe(
      switchMap(words => this.wikiService.getItems(words))
    );
  }

  setupGameCardsFromItems(items: MatchItem[]): void {
    const {words, images} = this.gameSetupService.setupCards(items);
    this.store.words.set(words);
    this.store.images.set(images);
  }

  selectWord(word: WordCard): void {
    if (word.matched) return;
    this.store.selectedWordId.set(word.id);
    this.tryMatch();
  }

  selectImage(image: ImageCard): void {
    if (image.matched) return;
    this.store.selectedImageId.set(image.id);
    this.tryMatch();
  }


  private tryMatch(): void {
    const wordId = this.store.selectedWordId();
    const imageId = this.store.selectedImageId();
    const isNotReady = wordId == null || imageId == null;

    if (isNotReady) return;

    const isCorrect = wordId === imageId;
    if (isCorrect) {
      this.store.words.set(this.gameSetupService.markMatched(this.store.words(), wordId!));
      this.store.images.set(this.gameSetupService.markMatched(this.store.images(), wordId!));
    }

    this.store.message.set(this.gameSetupService.setCardMatchFeedback(isCorrect));
    setTimeout(() => this.store.resetSelections(), 800);
  }

}
