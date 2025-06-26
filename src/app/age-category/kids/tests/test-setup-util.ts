import {provideHttpClientTesting} from '@angular/common/http/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {DeferBlockBehavior, DeferBlockState, TestBed} from '@angular/core/testing';

import {of} from 'rxjs';
import {MatchWordsGameComponent} from '../match-words-game/match-words-game.component';
import {MatchWordsService} from '../match-words-game/match-words.service';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {VocabularyService} from '../../../shared/services/vocabulary.service';
import {matchItems} from '../../../../assets/test-data/match-items';
import {WikiService} from '../../../shared/services/wiki.service';
import {provideRouter} from '@angular/router';
import {MatchItem} from '../../../shared/models/kids.models';
import {provideHttpClient} from '@angular/common/http';
import {CategoryService} from '../../../data-access/category.service';
import {DEFAULT_CATEGORIES} from '../../../shared/game-config.constants';
import wordsFromAnimals from './mocks/valid-words-from-animals-category.json'
import {signal} from '@angular/core';

const baseProviders = [
  MatchWordsStore,
  MatchWordsService,
  provideHttpClient(),
  provideHttpClientTesting(),
];


export async function setupMatchComponent
(options: {
  withDefer?: boolean,
  withMockServices?: boolean
} = {}) {
  const {withDefer = false, withMockServices = false} = options;
  const mockServices = [{
    provide: VocabularyService,
    useValue: {getList: () => of(matchItems.map(i => i.word))}
  },
    {
      provide: WikiService,
      useValue: {getItems: () => of(structuredClone(matchItems))}
    }];

  await TestBed.configureTestingModule({
    imports: [MatchWordsGameComponent],
    providers: [...baseProviders,
      ...(withMockServices ? mockServices : [])],
    ...(withDefer && {deferBlockBehavior: DeferBlockBehavior.Manual}),
  }).compileComponents();


  const fixture = TestBed.createComponent(MatchWordsGameComponent);
  const component = fixture.componentInstance;
  const store = fixture.debugElement.injector.get(MatchWordsStore);
  const service = TestBed.inject(MatchWordsService);

  return {fixture, component, store, service}
}

export async function setupMatchWordComponent() {

  const mockCategoryService = {
    getAllWordCategories: () => of(DEFAULT_CATEGORIES),
    getAllWordsInGroup: (groupId: number) => of(wordsFromAnimals.data),
    errorMsg: signal(null)
  };

  const moduleDef = {
    imports: [
      MatchWordsGameComponent,
      BrowserTestingModule,
    ],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      MatchWordsService,
      MatchWordsStore,
      {
        provide: VocabularyService,
        useValue: {getList: () => of(matchItems.map(i => i.word))}
      },
      {
        provide: WikiService,
        useValue: {getItems: () => of(structuredClone(matchItems))}
      },
      {provide: CategoryService, useValue: mockCategoryService}
    ],
    deferBlockBehavior: DeferBlockBehavior.Manual,
  };
  TestBed.configureTestingModule(moduleDef);

  const fixture = TestBed.createComponent(MatchWordsGameComponent);

  const [deferBlock] = await fixture.getDeferBlocks();
  await deferBlock.render(DeferBlockState.Complete);

  fixture.componentInstance.gameReady.set(true);
  return fixture;
}

export async function setupMatchWordComponentEndGameState() {
  const fixture = await setupMatchWordComponent();

  fixture.componentInstance.gameOver.set(true); // force modal to show

  fixture.detectChanges();
  return fixture;
}

export function setupGameStart(store: MatchWordsStore, service: MatchWordsService) {
  store.items.set(structuredClone(matchItems));
  service.initializeGamePlay();
}

export function getMatchedItemsMock(items: MatchItem[]): MatchItem[] {
  return items.map(item => ({...item, matched: true}));
}

export function getSortedIDs(prevGameItems: MatchItem[]) {
  return prevGameItems.map(item => item.id).sort();
}

/**
 * Progresses the game to the next stage if the current stage is complete.
 * This function mocks the behavior of marking all items in the current stage as matched,
 * sets the current stage to the specified final stage, and triggers the progression logic.
 *
 * @param service - The `MatchWordsService` instance managing the game logic.
 * @param store - The `MatchWordsStore` instance holding the game state.
 * @param finalStage - The stage to set as the current stage before progressing.
 */
export function setGivenStageComplete(service: MatchWordsService, store: MatchWordsStore, finalStage: number) {
  spyOn(service, 'getCurrentStageItems').and.returnValue(getMatchedItemsMock(matchItems));
  store.currentStage.set(finalStage);
  service.progressGameIfStageComplete();
}

export function setupCurrentAndReshuffledGameItems(store: MatchWordsStore, service: MatchWordsService) {
  const prevGameItems: MatchItem[] = store.shuffledItemsSlice();
  service.reshuffleCurrentGameItems();
  const reShuffledItems = store.shuffledItemsSlice();
  return {endGameItems: prevGameItems, replayGameItems: reShuffledItems};
}

export function setupAndValidateEndGameState(service: MatchWordsService, store: MatchWordsStore, finalStage: number, totalGameItems: number) {
  store.currentStage.set(finalStage);
  store.gameOver.set(true);
  const allMatched = getMatchedItemsMock(store.shuffledItemsSlice());
  store.shuffledItemsSlice.set(allMatched);

  expect(service.getGameOverSignal()).toBeTrue();
  expect(store.shuffledItemsSlice().length).toBe(totalGameItems);
  expect(service.getCurrentStage()).toBe(finalStage);
  expect(store.shuffledItemsSlice().every(
    item => item.matched
  )).toBeTrue();
}

export function expectValidReplayGameState(reShuffleSpy: jasmine.Spy<jasmine.Func>, service: MatchWordsService, firstStage: number, store: MatchWordsStore) {
  expect(reShuffleSpy).toHaveBeenCalled();
  expect(service.getCurrentStage()).toBe(firstStage);
  expect(store.shuffledItemsSlice().every(
    item => item.matched
  )).toBeFalse();
  expect(store.gameOver()).toBeFalse();
}

export function expectValidNewGameState(service: MatchWordsService, firstStage: number, store: MatchWordsStore) {
  expect(service.getGameOverSignal()).toBeFalse();
  expect(service.getCurrentStage()).toBe(firstStage);
  expect(store.shuffledItemsSlice().some(item => item.matched)).toBeFalse();
}

export function expectNewItemsComparedTo(endGameItems: MatchItem[], newGameItems: MatchItem[]): void {
  const [endGameIDs, newGameIDs] = getEndAndNewGameItemIDs(endGameItems, newGameItems);

  const hasNewItems: boolean = hasNewIDsComparedTo(newGameIDs, endGameIDs);

  expect(newGameItems.length).toBe(endGameItems.length);
  expect(getSortedIDs(newGameItems)).not.toEqual(getSortedIDs(endGameItems));
  expect(newGameItems).not.toBe(endGameItems);
  expect(hasNewItems).toBeTrue();
}

function hasNewIDsComparedTo(newGameItemIDs: number[], endGameItemsIDs: number[]) {
  return newGameItemIDs.some(id => {
    return !endGameItemsIDs.includes(id);
  });
}

function getEndAndNewGameItemIDs(endGameItems: MatchItem[], newGameItems: MatchItem[]) {
  return [
    getSortedIDs(endGameItems),
    getSortedIDs(newGameItems)
  ]
}
