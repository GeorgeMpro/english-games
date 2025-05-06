import {Injectable} from '@angular/core';
import {catchError, Observable, of, switchMap, take, tap} from 'rxjs';

import {GameLogicService} from '../../../shared/services/game-logic.service';
import {WikiService} from '../../../shared/services/wiki.service';
import {Category, VocabularyService} from '../../../shared/services/vocabulary.service';
import {MatchWordsStore} from './match-words.store';
import {ImageCard, MatchItem, WordCard} from '../../../shared/models/kids.models';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class MatchWordsService {
  // TODO
  //  1 get all items
  //      handle good/error
  //  2 split items into x stages with total/x items each or a max amount
  //     can take a slice of the total array like 18 out of 22
  //    Note: this functionality will be called in game logic
  //  3 manage stage progression
  //  4 collect feedback - right/wrong
  //  5 connect to component
  //    display and functionality
  //  6 add retry - the same items re shuffled
  //    add replay - new game and slice from the whole item list
  //  7 add to component: feedback
  //  8 add to component: retry and replay


  constructor(
    private readonly store: MatchWordsStore,
    private readonly gameLogicService: GameLogicService,
    private readonly wikiService: WikiService,
    private readonly vocabularyService: VocabularyService
  ) {

  }

  // todo only usage - add number of stage and items per stage
  // todo move the subscribe to the component


  setupGameItems(category: Category): Observable<boolean> {
    return this.fetchItemsByCategory(category).pipe(
      take(1),
      tap(items => {
        this.store.items.set(items);
        this.setupGameCardsFromItems(items);
      }),
      map(() => true),
      catchError(() => {
        this.store.message.set('⚠️ Failed to load items.');
        return of(false);
      })
    );
  }


  private fetchItemsByCategory(category: Category): Observable<MatchItem[]> {
    return this.vocabularyService.getList(category).pipe(
      switchMap(words => this.wikiService.getItems(words))
    );
  }

  setupGameCardsFromItems(items: MatchItem[]): void {
    const {words, images} = this.gameLogicService.setupCards(items);
    this.store.words.set(words);
    this.store.images.set(images);
  }

  selectWord(word: WordCard): void {
    if (word.matched) {
      return;
    }
    this.store.selectedWordId.set(word.id);
    this.tryMatch();
  }

  selectImage(image: ImageCard): void {
    if (image.matched) {
      return;
    }
    this.store.selectedImageId.set(image.id);
    this.tryMatch();
  }

  // todo cleanup
  //  does too much
  //  too big
  private tryMatch(): void {
    const wordId = this.store.selectedWordId();
    const imageId = this.store.selectedImageId();

    const result = this.gameLogicService.tryMatchResult(
      wordId,
      imageId,
      this.store.words(),
      this.store.images()
    );


    if (!result) {
      return;
    }
    this.updateValues(result);
    this.executeReset();
  }

  updateValues(
    result: { updatedWords: WordCard[]; updatedImages: ImageCard[]; message: string; }) {
    const {updatedWords, updatedImages, message} = result;
    this.store.words.set(updatedWords);
    this.store.images.set(updatedImages);
    this.store.message.set(message);
  }

  private executeReset(timeout: number = 800) {
    setTimeout(() => this.store.resetSelections(), timeout);
  }

  // *******************
  // TODO adding stage functionality
  /**
   * Initializes a shuffled slice of items for the current game.
   *
   * Shuffles the full item list and selects only the items needed
   * to cover all stages.
   *
   * The result is stored in the `shuffledItemsSlice` signal.
   *
   * @param stages - Total number of stages in the game.
   * @param itemsPerStage - Number of items required per stage.
   */
  initializeShuffledItemsSlice(stages: number, itemsPerStage: number): void {
    const totalItems = stages * itemsPerStage;
    const shuffledCopy: MatchItem[] = this.gameLogicService.generateShuffledItemCopy(this.store.items());

    this.store.shuffledItemsSlice.set(shuffledCopy.slice(0, totalItems));
  }

  /**
   * Divides the shuffled item slice into individual stage groups.
   *
   * Updates the `stageItems` signal.
   *
   * @param stages - Number of stages.
   * @param itemsPerStage - Number of items per stage.
   */
  initializeItemsForStage(stages: number, itemsPerStage: number): void {
    const shuffledItemsSlicedByStages: MatchItem[][] = this.gameLogicService.generateItemSlicesForEachStage(
      this.store.shuffledItemsSlice(),
      stages,
      itemsPerStage);

    this.store.stageItems.set(shuffledItemsSlicedByStages);
  }

//   todo extract items from slices and give them component?
  /**
   * Returns all stage groups with their index and associated items.
   *
   * Used by the component to render or manage stages sequentially.
   *
   * @returns An array of objects, each containing a stage index and its items.
   */
  getItemsForStages(): { index: number; items: MatchItem[] }[] {
    return this.store.stageItems().map((items: MatchItem[], index: number) => ({index, items}));
  }


}
