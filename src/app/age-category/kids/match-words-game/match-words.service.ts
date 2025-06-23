import {Injectable} from '@angular/core';

import {catchError, forkJoin, Observable, of, switchMap, take, tap} from 'rxjs';
import {map} from 'rxjs/operators';

import {GameLogicService} from '../../../shared/services/game-logic.service';
import {WikiService} from '../../../shared/services/wiki.service';
import {Category, VocabularyService} from '../../../shared/services/vocabulary.service';
import {MatchWordsStore} from './match-words.store';
import {ImageCard, MatchAttempt, MatchItem, MatchResult, WordCard} from '../../../shared/models/kids.models';
import {
  DEFAULT_ITEMS_PER_STAGE,
  DEFAULT_STAGE_COUNT,
  DEFAULT_FIRST_STAGE,
  MATCH_RESET_TIMEOUT_DELAY,
} from '../../../shared/game-config.constants';
import {WordGroup} from '../../../data-access/api.models';

// todo does too much - split
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
        // this.store.items.set(items);
        this.setGameItems(items);
      }),
      map(() => true),
      catchError(() => {
        // todo extract to message service
        //todo displays error when already loaded items but is not connected to the internet
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
   * Initializes shuffled items, dividing them into stages,
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
    const shuffledCopy: MatchItem[] = this.gameLogicService.generateShuffledItemCopy(this.getStoreItems());

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

  // todo working on feedback and counting match attempts
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
    // todo adding unique match tries

    const result: MatchResult | null = this.getMatchResult();

    if (result) {
      this.handleMatchResult(result);
      this.executeReset();
    }
    this.updateMatchAttemptMap();
  }

  // todo
  updateMatchAttemptMap(): void {
    const wordId: number = this.store.selectedWordId()!;
    const imageId: number = this.store.selectedImageId()!;
    const prev: Map<number, MatchAttempt> = this.store.uniqueCorrectMatchAttemptCounter();
    const updated: Map<number, MatchAttempt> = this.gameLogicService.updateMatchAttempts(wordId, imageId, prev);

    this.store.uniqueCorrectMatchAttemptCounter.set(updated);
  }


  // todo
  getMatchAttemptById(id: number) {
    return this.store.uniqueCorrectMatchAttemptCounter().get(id);
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
    this.progressGameIfStageComplete();
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
  progressGameIfStageComplete(): void {
    let areMatched = this.getCurrentStageItems().every(item => item.matched);
    if (!areMatched) {
      return
    }
    if (this.getCurrentStage() === DEFAULT_STAGE_COUNT - 1) {
      this.store.gameOver.set(true);
    } else {
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

  // TODO Working on GAME OVER, FEEDBACK, REPLAY, NEW GAME
  //  add doc
  //  connect to component - buttons
  //  connect to modal - display
  getGameOverSignal(): Readonly<boolean> {
    return this.store.gameOver() as Readonly<boolean>;
  }

  replayGame(): void {
    this.reshuffleCurrentGameItems();  // reshuffle slice
    this.resetMatchValues();           // clear matched flags
    this.resetGameSignals();
    this.reinitializeStageAndCards();
    this.store.resetSelections();
  }

  private resetGameSignals() {
    this.store.gameOver.set(false);

    this.store.currentStage.set(DEFAULT_FIRST_STAGE);
  }

  private reinitializeStageAndCards() {
    // Notice: clears `matched` class from CSS classes in the cards
    this.initializeItemsForStage(DEFAULT_STAGE_COUNT, DEFAULT_ITEMS_PER_STAGE);

    // 💥 now use the updated stage items to rebuild cards
    this.generateGameCardsFromItems(this.getCurrentStageItems());
  }

  reshuffleCurrentGameItems(): void {
    const reshuffledItems = this.gameLogicService.generateShuffledItemCopy(this.store.shuffledItemsSlice());
    this.store.shuffledItemsSlice.set(reshuffledItems);
  }

//   todo new game
  newGame() {
    this.resetGameState();

    this.initializeGamePlay();
  }

  resetGameState() {
    this.resetMatchValues();
    this.store.gameOver.set(false);
    this.store.currentStage.set(DEFAULT_FIRST_STAGE);
    this.store.uniqueCorrectMatchAttemptCounter().clear();
  }

  // todo extract choose modal
  /**
   * Resets all match-related values in the game state.
   *
   * This method performs the following:
   * 1. Resets all items in the `shuffledItemsSlice` to unmatched.
   * 2. Clears the `uniqueCorrectMatchAttemptCounter` map.
   */
  resetMatchValues(): void {
    const unmatchedItems: MatchItem[] = this.store.shuffledItemsSlice().map((item: MatchItem) => {
      return ({...item, matched: false})
    });

    this.store.shuffledItemsSlice.set(unmatchedItems);
    this.store.uniqueCorrectMatchAttemptCounter.set(new Map<number, MatchAttempt>());
  }

  // todo modal data
  countUniqueCorrect(): number {
    return Array.from(this.store.uniqueCorrectMatchAttemptCounter().values())
      .filter(attempt => attempt.correctOnFirstTry).length;
  }

  countTotalItems(): number {
    const map = this.store.uniqueCorrectMatchAttemptCounter();

    // Notice: filter NaN values
    const validKeys = Array.from(map.keys()).filter(
      key => typeof key === 'number' && !Number.isNaN(key));

    return validKeys.length;
  }

  // todo maybe extract choosing new category
  /*New Categories*/
  handleNewCategoriesGame(categories: WordGroup[]) {
    this.resetGameState();

    // const fetches = categories.map(cat => this.vocabularyService.getList(cat as Category));

    // forkJoin(fetches).subscribe((allCategoryWords: string[][]) => {
    //   const mergedWords = allCategoryWords.flat();
    //   this.store.wordsFromChosenCategories.set(mergedWords);
    // });

    this.startGameFromChosenCategories();
  }

  startGameFromChosenCategories() {
    // todo extract subscribe for all init funcs here
    this.wikiService.getItems(this.store.wordsFromChosenCategories()).subscribe({
        next: (items: MatchItem[]) => {
          this.setGameItems(
            this.assignUniqueIds(items)
          );
          this.initializeGamePlay();
        }
      }
    );
  }

  private setGameItems(items: MatchItem[]) {
    this.store.items.set(items);
  }

  private getStoreItems() {
    return this.store.items();
  }

  /**
   * Assigns unique sequential IDs to a list of MatchItems.
   *
   * This function ensures that each MatchItem in the array has a unique `id` field,
   * regardless of its original value. This is critical when combining items from
   * multiple categories, where duplicate IDs may exist and cause matching conflicts.
   *
   * The new IDs start from 1 and increment by 1 for each item.
   * All other fields are preserved via object spreading.
   *
   * @param items - The array of MatchItem objects (possibly with duplicate IDs).
   * @returns A new array of MatchItems with unique `id` values assigned.
   */
  private assignUniqueIds(items: MatchItem[]): MatchItem[] {
    return items.map((item, index) => ({
      ...item,
      id: index + 1
    }));
  }
}
