import {Injectable} from '@angular/core';
import {catchError, Observable, of, switchMap, take, tap} from 'rxjs';
import {map} from 'rxjs/operators';

import {GameLogicService} from '../../../shared/services/game-logic.service';
import {WikiService} from '../../../shared/services/wiki.service';
import {Category, VocabularyService} from '../../../shared/services/vocabulary.service';
import {MatchWordsStore} from './match-words.store';
import {ImageCard, MatchItem, MatchResult, WordCard} from '../../../shared/models/kids.models';

export const MATCH_RESET_TIMEOUT = 300;
export const DEFAULT_STAGE_COUNT = 3;
export const DEFAULT_ITEMS_PER_STAGE = 6;


@Injectable({providedIn: 'root'})
export class MatchWordsService {

  constructor(
    private readonly store: MatchWordsStore,
    private readonly gameLogicService: GameLogicService,
    private readonly wikiService: WikiService,
    private readonly vocabularyService: VocabularyService
  ) {

  }

  initializeGameData(category: Category): Observable<boolean> {
    return this.fetchItemsByCategory(category).pipe(
      take(1),
      tap(items => {
        this.store.items.set(items);
      }),
      map(() => true),
      catchError(() => {
        this.store.matchAttemptMessage.set('⚠️ Failed to load items.');
        return of(false);
      })
    );
  }

  private fetchItemsByCategory(category: Category): Observable<MatchItem[]> {
    return this.vocabularyService.getList(category).pipe(
      switchMap(words => this.wikiService.getItems(words))
    );
  }

  initializeGamePlay(stages: number = DEFAULT_STAGE_COUNT, itemsPerStage: number = DEFAULT_ITEMS_PER_STAGE): void {
    this.initializeShuffledItemsSlice(stages, itemsPerStage);
    this.initializeItemsForStage(stages, itemsPerStage);
    this.setupGameCardsFromItems(this.getCurrentStageItems());
  }

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
  private initializeShuffledItemsSlice(stages: number, itemsPerStage: number): void {
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

  /**
   * Prepares word and image cards from the given match items,
   * using game logic to shuffle and split them into card decks.
   *
   * Stores the results in the reactive store for rendering.
   *
   * @param items - The match items for the current stage.
   */
  setupGameCardsFromItems(items: MatchItem[]): void {
    const {words, images} = this.gameLogicService.setupCards(items);
    this.store.wordCards.set(words);
    this.store.imageCards.set(images);
  }

  selectWord(word: WordCard): void {
    if (word.matched) {
      return;
    }
    this.store.selectedWordId.set(word.id);
    this.processMatchAttempt();
  }

  selectImage(image: ImageCard): void {
    if (image.matched) {
      return;
    }
    this.store.selectedImageId.set(image.id);
    this.processMatchAttempt();
  }

  // todo
  private processMatchAttempt(): void {
    const result: MatchResult | null = this.getMatchResult();

    if (result) {
      this.handleMatchResult(result);
    }
    // todo centralize message feedback service and extract from the logic service
    this.executeReset();
  }

  private handleMatchResult(result: MatchResult) {
    this.applyMatchResult(result);
    this.progressIfStageComplete();
  }

  private applyMatchResult(result: MatchResult) {
    this.updateValues(result);
    this.updateStageItemsMatched(
      result.updatedWords.filter(w => w.matched).map(w => w.id)
    );
  }

  private getMatchResult(): MatchResult | null {
    return this.gameLogicService.tryMatchResult(
      this.store.selectedWordId(),
      this.store.selectedImageId(),
      this.store.wordCards(),
      this.store.imageCards()
    );
  }

// todo update?
  private updateValues(result: {
    updatedWords: WordCard[];
    updatedImages: ImageCard[];
    message: string;
  }): void {
    const {updatedWords, updatedImages, message} = result;

    this.store.wordCards.set(updatedWords);
    this.store.imageCards.set(updatedImages);
    this.store.matchAttemptMessage.set(message);
  }

  private updateStageItemsMatched(ids: number[]): void {
    const currentStage = this.getCurrentStage();
    const stageItems = [...this.store.stageItems()];
    stageItems[currentStage] = stageItems[currentStage].map(item =>
      ids.includes(item.id) ? {...item, matched: true} : item
    );
    this.store.stageItems.set(stageItems);
  }

  progressIfStageComplete(): void {
    let areMatched = this.getCurrentStageItems().every(item => item.matched);
    if (areMatched) {
      this.progressStage();
    }
  }

  private progressStage(): void {
    this.store.currentStage.update(stage => stage + 1);
  }

  private executeReset(timeout: number = MATCH_RESET_TIMEOUT): void {
    setTimeout(() => this.store.resetSelections(), timeout);
  }

  getCurrentStageItems(): MatchItem[] {
    const stageItems = this.store.stageItems();
    return stageItems[this.getCurrentStage()];
  }

  getCurrentStage(): number {
    return this.store.currentStage();
  }

  // TODO
  //  - keep all game items for new game
  //  - keep shuffled slice for retry
  //  - pass items for stage to the component
  //  -
  // TODO
  //  1 get all items
  //      handle good/error
  //  3 manage stage progression (update 1 not 0 for user)
  //  4 collect feedback - right/wrong
  //  5 connect to component
  //    display and functionality
  //  6 add retry - the same items re shuffled
  //    add replay - new game and slice from the whole item list
  //  7 add to component: feedback
  //  8 add to component: retry and replay

}
