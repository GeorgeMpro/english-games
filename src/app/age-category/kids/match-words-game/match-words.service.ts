import {Injectable} from '@angular/core';

import {catchError, Observable, of, switchMap, take, tap} from 'rxjs';
import {map} from 'rxjs/operators';

import {GameLogicService} from '../../../shared/services/game-logic.service';
import {WikiService} from '../../../shared/services/wiki.service';
import {Category, VocabularyService} from '../../../shared/services/vocabulary.service';
import {MatchWordsStore} from './match-words.store';
import {ImageCard, MatchItem, MatchResult, WordCard} from '../../../shared/models/kids.models';
import {
  DEFAULT_ITEMS_PER_STAGE,
  DEFAULT_STAGE_COUNT,
  MATCH_RESET_TIMEOUT_DELAY
} from '../../../shared/game-config.constants';


@Injectable({providedIn: 'root'})
export class MatchWordsService {

  constructor(
    private readonly store: MatchWordsStore,
    private readonly gameLogicService: GameLogicService,
    private readonly wikiService: WikiService,
    private readonly vocabularyService: VocabularyService
  ) {

  }

  /**
   * Initializes the game data by fetching items for the specified category.
   *
   * Steps:
   * 1. Fetches match items based on the given category.
   * 2. Stores the fetched items in the reactive store.
   * 3. Returns an observable indicating success or failure.
   *
   * @param category - The category of items to fetch.
   * @returns An observable that emits `true` on success or `false` on failure.
   */
  initializeGameData(category: Category): Observable<boolean> {
    return this.fetchItemsByCategory(category).pipe(
      take(1),
      tap(items => {
        this.store.items.set(items);
      }),
      map(() => true),
      catchError(() => {
        // todo extract to message service
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

  /**
   * Sets up the game play by initializing shuffled items, dividing them into stages,
   * and generating word and image cards for the current stage.
   *
   * Steps:
   * 1. Initializes a shuffled slice of items for the game.
   * 2. Divides the shuffled items into stage-specific groups.
   * 3. Generates word and image cards for the first stage.
   *
   * @param stages - Total number of stages in the game (default is `DEFAULT_STAGE_COUNT`).
   * @param itemsPerStage - Number of items per stage (default is `DEFAULT_ITEMS_PER_STAGE`).
   */
  initializeGamePlay(
    stages: number = DEFAULT_STAGE_COUNT,
    itemsPerStage: number = DEFAULT_ITEMS_PER_STAGE): void {
    this.initializeShuffledItemsSlice(stages, itemsPerStage);
    this.initializeItemsForStage(stages, itemsPerStage);
    this.generateGameCardsFromItems(this.getCurrentStageItems());
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
  generateGameCardsFromItems(items: MatchItem[]): void {
    const {words, images} = this.gameLogicService.setupCards(items);
    this.store.wordCards.set(words);
    this.store.imageCards.set(images);
  }

  /**
   * Handles the selection of a word card.
   *
   * If the selected word is not already matched, it updates the store
   * with the selected word's ID and triggers a match attempt.
   *
   * @param word - The word card selected by the user.
   */
  handleWordSelection(word: WordCard): void {
    if (!word.matched) {
      this.store.selectedWordId.set(word.id);
      this.processMatchAttempt();
    }

  }

  /**
   * Handles the selection of an image card.
   *
   * If the selected image is not already matched, it updates the store
   * with the selected image's ID and triggers a match attempt.
   *
   * @param image - The image card selected by the user.
   */
  handleImageSelection(image: ImageCard): void {
    if (!image.matched) {
      this.store.selectedImageId.set(image.id);
      this.processMatchAttempt();
    }
  }

  /**
   * Coordinates a match attempt using the currently selected word and image.
   *
   * If a valid match is found, it updates the game state accordingly and
   * resets selections after a short delay.
   *
   * Steps:
   * 1. Compute the match result based on current selections.
   * 2. If a match exists:
   *    - Apply the result to the store (cards, message, matched items).
   *    - Progress the stage if all items are matched.
   *    - Reset selections after a timeout.
   */
  private processMatchAttempt(): void {
    const result: MatchResult | null = this.getMatchResult();

    if (result) {
      this.handleMatchResult(result);
      this.executeReset();
    }
  }

  private getMatchResult(): MatchResult | null {
    return this.gameLogicService.tryMatchResult(
      this.store.selectedWordId(),
      this.store.selectedImageId(),
      this.store.wordCards(),
      this.store.imageCards()
    );
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

  /**
   * Checks if all items in the current stage are matched.
   *
   * If all items are matched, progresses to the next stage
   * by updating the `currentStage` signal.
   */
  progressIfStageComplete(): void {
    let areMatched = this.getCurrentStageItems().every(item => item.matched);
    if (areMatched) {
      this.progressStage();
    }
  }

  private executeReset(delay: number = MATCH_RESET_TIMEOUT_DELAY): void {
    setTimeout(() => this.store.resetSelections(), delay);
  }

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

  private progressStage(): void {
    this.store.currentStage.update(stage => stage + 1);
  }

  getCurrentStageItems(): MatchItem[] {
    const stageItems = this.store.stageItems();
    return stageItems[this.getCurrentStage()];
  }

  getCurrentStage(): number {
    return this.store.currentStage();
  }
}
