import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

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


  getWordsFromCategory(categoryId: number): Observable<WordItem[]> {
    return this.catService.getAllWordsInGroup(categoryId)
  }

  getStore(): MatchSoundsStore {
    return this.store;
  }


  // todo update to num | num[]
  initializeGame(categoryId: number): void {
    this.getWordsFromCategory(categoryId).subscribe(words => this.setupGame(words));
  }

  setupGame(words: WordItem[]) {
    this.setWordsFromChosenCategories(words);
    this.initializeMatchItemsFromWords(words);
    this.initializeShuffledItemsSlice();
    this.setupStages();
  }

  private setWordsFromChosenCategories(words: WordItem[]): void {
    this.store.wordsFromChosenCategories.set(words);
  }

  private initializeMatchItemsFromWords(words: WordItem[]): void {
    const matchItems: MatchItem[] = this.converterService.wordItemsToMatchItems(words);

    this.store.items.set(matchItems);
  }

  private initializeShuffledItemsSlice(stages: number = DEFAULT_STAGE_COUNT, itemsPerStage: number = DEFAULT_ITEMS_PER_STAGE): void {

    const totalItems = stages * itemsPerStage;

    const shuffledCopy: MatchItem[] = this.logicService.generateShuffledItemCopy(this.store.items());

    this.store.shuffledItemsSlice.set(
      shuffledCopy.slice(0, totalItems)
    );

  }

  private setupStages(stages: number = DEFAULT_STAGE_COUNT, itemsPerStage: number = DEFAULT_ITEMS_PER_STAGE) {
    const shuffledItemsSlicedByStages: MatchItem[][] = this.logicService.generateItemSlicesForEachStage(this.store.shuffledItemsSlice(), stages, itemsPerStage);

    this.store.stageItems.set(shuffledItemsSlicedByStages);
  }


  progressStage(): void {
    this.store.progressStage();
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
