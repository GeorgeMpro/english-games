import {Injectable} from '@angular/core';

import {forkJoin, Observable} from 'rxjs';

import {CategoryService} from '../../../../data-access/category.service';
import {WordItem} from '../../../../data-access/api.models';
import {MatchSoundsStore} from '../../match-sounds-game/match-sounds.store';
import {ItemConverterService} from '../../../../shared/services/item-converter.service';
import {MatchItem} from '../../../../shared/models/kids.models';
import {GameLogicService} from '../../../../shared/services/game-logic.service';
import {DEFAULT_ITEMS_PER_STAGE, DEFAULT_STAGE_COUNT} from '../../../../shared/game-config.constants';

@Injectable({
  providedIn: 'root'
})
export class MatchSoundsWordsService {

  constructor(
    private store: MatchSoundsStore,
    private catService: CategoryService,
    private logicService: GameLogicService,
    private converterService: ItemConverterService) {
  }


  initializeGame(categoryId: number): void {
    this.getWordsFromCategory(categoryId).subscribe(words => this.setupGame(words));
  }

  getWordsFromCategory(categoryId: number): Observable<WordItem[]> {
    return this.catService.getAllWordsInGroup(categoryId)
  }


  // todo update to num | num[]
  setupGame(words: WordItem[]) {
    this.setWordsFromChosenCategories(words);
    this.initializeMatchItemsFromWords(words);
    this.initializeShuffledItemsSlice();
    this.setupStages();
    this.setupMainStageItems();
  }

  private setWordsFromChosenCategories(words: WordItem[]): void {
    this.store.wordsFromChosenCategories.set(words);
  }

  private initializeMatchItemsFromWords(words: WordItem[]): void {
    const matchItems: MatchItem[] = this.converterService.wordItemsToMatchItems(words);

    this.store.items.set(matchItems);
  }

  private initializeShuffledItemsSlice(stages: number = DEFAULT_STAGE_COUNT, itemsPerStage: number = DEFAULT_ITEMS_PER_STAGE): void {

    const totalItems: number = stages * itemsPerStage;

    const shuffledCopy: MatchItem[] = this.logicService.generateShuffledItemCopy(this.store.items());

    this.store.shuffledItemsSlice.set(
      shuffledCopy.slice(0, totalItems)
    );

  }

  private setupStages(stages: number = DEFAULT_STAGE_COUNT, itemsPerStage: number = DEFAULT_ITEMS_PER_STAGE) {
    const shuffledItemsSlicedByStages: MatchItem[][] = this.logicService.generateItemSlicesForEachStage(this.store.shuffledItemsSlice(), stages, itemsPerStage);

    this.store.stageItems.set(shuffledItemsSlicedByStages);
  }

  /**
   * Sets the main word for each stage.
   * Assumes that `stageItems` have already been shuffled,
   * so the first item of each stage is used as the main word.
   */
  private setupMainStageItems(): void {
    const stages = this.store.stageItems();
    const mainItems: MatchItem[] = stages.map(stage => stage[0]);
    this.store.mainWords.set(mainItems);
  }

  progressStage(): void {
    this.store.progressStage();
  }

  getStore(): MatchSoundsStore {
    return this.store;
  }

  getCurrentMainWord(): MatchItem {
    return this.store.getCurrentMainWord();
  }

  getCurrentStageItems(): any {
    return this.store.currentStageItems();
  }

  /*New Categories */
  newCategoriesGame(categories: number[]) {
    // Notice: forkJoin silently resolves empty array without calling setup items.
    // the if-clause is a guard
    if (!categories.length) return;

    this.resetGameState();

    this.processCategoryRequests(categories);
  }

  private processCategoryRequests(categories: number[]) {
    const requests = this.generateCategoryObservables(categories);

    forkJoin(requests).subscribe(
      (wordGroups: WordItem[][]) => {
        const allWordsFromGroups = wordGroups.flat();
        this.setupGame(allWordsFromGroups);
      });
  }

  private generateCategoryObservables(categories: number[]) {
    return categories.map(id => this.getWordsFromCategory(id));
  }

  resetGameState() {
    this.store.reset();
  }

  processMatchAttempt(itemId: number): void {
    const isAMatch = itemId === this.getMainStageItemId();

    if (isAMatch) {
      this.store.uniqueMatches.update(currentCount => currentCount + 1);
      this.getCurrentMainWord().matched = true;
      this.progressStage();
    }
  }

  // todo move to store?
  getMainStageItemId(): number {
    return this.getCurrentMainWord().id;
  }
}

// TODO
//  get words
//  copy items
//  shuffle copy items
//  get item slice for game
//  crate match items from words
//  generate stages for items in slice
//  select word to say in each stage
//  display the words
//  can interact with the words
//  progress stages
//  select main word ( the one that is sounded )
