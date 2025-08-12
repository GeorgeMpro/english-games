import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {of} from 'rxjs';

import {MatchSoundsWordsService} from './match-sounds-words.service';
import {CategoryService} from '../../../../data-access/category.service';
import {ItemConverterService} from '../../../../shared/services/item-converter.service';
import {GameLogicService} from '../../../../shared/services/game-logic.service';
import {MatchSoundsStore} from '../../match-sounds-game/match-sounds.store';
import {WordItem} from '../../../../data-access/api.models';
import {MatchItem} from '../../../../shared/models/kids.models';
import {fallbackDataMap} from '../../match-words-game/category-json-mapper';
import {DEFAULT_STAGE_COUNT} from '../../../../shared/game-config.constants';

describe('MatchSoundsWordsService', () => {
  let soundService: MatchSoundsWordsService;
  let catService: CategoryService;

  beforeEach(() => {
    ({soundService, catService} = setupMatchSound());
  });

  it('should be created', () => {
    expect(soundService).toBeTruthy();
  });
});

describe('fetch words from category', () => {
  let soundService: MatchSoundsWordsService;
  let catService: CategoryService;

  beforeEach(() => {
    ({soundService, catService} = setupMatchSound());
  });

  it('should call CategoryService and return its result', () => {
    const categoryId = 4;
    const mockWords: WordItem[] = fallbackDataMap[categoryId];
    spyOn(catService, 'getAllWordsInGroup').and.returnValue(of(mockWords));

    soundService.getWordsFromCategory(categoryId).subscribe(words => {
      expect(words).toEqual(mockWords);
      expect(catService.getAllWordsInGroup).toHaveBeenCalledWith(categoryId);
    });
  });
});

describe('stage setup', () => {
  const categoryId = 4;
  let soundService: MatchSoundsWordsService;
  let catService: CategoryService;
  let converterService: ItemConverterService;
  let logicService: GameLogicService;

  beforeEach(() => {
    ({soundService, catService, converterService, logicService} = setupMatchSound());
  });

  describe('game initialization', () => {

    it('should fetch and store all chosen category items when initializing', () => {
      const {mockWords, store} = setupGameState(categoryId);

      expect(store.wordsFromChosenCategories()).toEqual(mockWords);
      expect(catService.getAllWordsInGroup).toHaveBeenCalledWith(categoryId);
    });


    it('should convert WordItems to MatchItems', () => {
      const {store} = setupGameState(categoryId);

      expect(converterService.wordItemsToMatchItems).toHaveBeenCalled()
      expect(store.items()).not.toEqual([]);
    });

    it('should generate a shuffled copy without mutating original MatchItems', () => {
      setupGameState(categoryId);

      expect(logicService.generateShuffledItemCopy).toHaveBeenCalled();
    });

    it('should store a slice of shuffled MatchItems and generate stage items', () => {
      const {store} = setupGameState(categoryId);

      expect(logicService.generateItemSlicesForEachStage).toHaveBeenCalled();
      expect(store.shuffledItemsSlice()).not.toEqual([]);
      expect(store.stageItems()).not.toEqual([]);
    });

    it('should setup game items - main word for stage', () => {
      const {store} = setupGameState(categoryId);

      // already shuffled so the main word is the index 0 of each stage
      for (let i = 0; i < DEFAULT_STAGE_COUNT; i++) {
        const stage: MatchItem[] = store.stageItems()[i];
        const mainWord: MatchItem = store.mainWords()[i];

        expect(stage).toContain(mainWord);
        expect(stage[0]).toEqual(mainWord);
      }
    });

    it('should get the current main word to component', () => {
      const {store} = setupGameState(categoryId);

      // already shuffled so the main word is the index 0 of each stage
      for (let i = 0; i < DEFAULT_STAGE_COUNT; i++) {
        const mainWord: MatchItem = store.mainWords()[i];

        expect(soundService.getCurrentMainWord()).toEqual(mainWord);
        completeCurrentStage(store);
        soundService.progressStage();
      }
    });

  });

  describe('stage progression', () => {
    it(' should advance stages until game finishes, should not advance after game is complete', () => {
      const finalStageFromZeroCount = DEFAULT_STAGE_COUNT - 1;
      //   game start
      const {store} = setupGameState(categoryId);

      expectStageProgression(store, DEFAULT_STAGE_COUNT);
      expect(store.currentStage()).toEqual(finalStageFromZeroCount);

      // stop advancing levels
      soundService.progressStage();
      expect(store.currentStage()).toEqual(finalStageFromZeroCount);
    });

    describe('game play', () => {

      const scenarios = [
        {name: "advance when all matched", mutate: completeCurrentStage, delta: 1},
        {name: "not advance when not all are matched", mutate: partlyMatchedCurrentStage, delta: 0},
      ]

      scenarios.forEach(({name, mutate, delta}) => {
        it(`should ${name}`, () => {
          const {store} = setupGameState(categoryId);
          const start = store.currentStage();

          expect(start).toEqual(0);
          expectStage(store, start);

          mutate(store);
          store.progressStage();

          expectStage(store, start + delta);
        });
      });

      it('should end game when finish final stage', () => {
        const {store} = setupGameState(categoryId);
        for (let i = 0; i < DEFAULT_STAGE_COUNT; i++) {
          completeCurrentStage(store);
          store.progressStage();
        }
        expect(store.currentStage()).toEqual(DEFAULT_STAGE_COUNT - 1);
        expect(store.gameOver()).toBeTrue();
      });

    });

    function expectStageProgression(store: MatchSoundsStore, finalStage: number) {
      let stage = 0;
      expect(store.currentStage()).toEqual(stage);
      for (stage; stage < finalStage; stage++) {
        store.currentStageItems().every(item => item.matched = true);
        expect(store.currentStage()).toEqual(stage);
        store.progressStage();
      }

      //   game end
      expect(store.gameOver()).toBeTruthy();
    }
  });

  xit('should not repeat main word - if possible', () => {
  });

  function setupGameState(categoryId: number) {
    const mockWords: WordItem[] = fallbackDataMap[categoryId];
    // Spies setup
    spyOn(catService, 'getAllWordsInGroup').and.returnValue(of(mockWords));
    spyOn(converterService, "wordItemsToMatchItems").and.callThrough();
    spyOn(logicService, 'generateShuffledItemCopy').and.callThrough();
    spyOn(logicService, 'generateItemSlicesForEachStage').and.callThrough();

    soundService.initializeGame(categoryId);

    return {mockWords, store: soundService.getStore()}
  }
});

describe('match handling', () => {
  const categoryId = 4;
  let soundService: MatchSoundsWordsService;
  let catService: CategoryService;
  let converterService: ItemConverterService;
  let logicService: GameLogicService;

  beforeEach(() => {
    ({soundService, catService, converterService, logicService} = setupMatchSound());
  });

  it('should update matched to true on correct match', () => {
    const {store} = setupGameState(categoryId);
    const stage = store.currentStage();
    expect(store.mainWords()).not.toEqual([]);
    expect(store.stageItems()).not.toEqual([]);
    const mainWord = soundService.getCurrentMainWord();
    soundService.processMatchAttempt(mainWord.id);

    expect(store.mainWords()[stage].matched).toBeTrue();
    expect(store.mainWords()[stage + 1].matched).toBeFalse();
  });

  it('should advance stage when correct match', () => {
    const {store} = setupGameState(categoryId);
    spyOn(soundService, 'progressStage').and.callThrough();

    // check unique id's
    const seen = new Set<number>();
    for (let stage = 0; stage < DEFAULT_STAGE_COUNT - 1; stage++) {
      const id = soundService.getMainStageItemId();
      expectStage(store, stage);
      soundService.processMatchAttempt(id);
      expect(seen.has(id)).toBeFalse();
      seen.add(id);

      expectStage(store, stage + 1);
      expect(soundService.progressStage).toHaveBeenCalledTimes(stage + 1);
    }

  });

  const WRONG_ID = -999;
  const scenarios = [
    {
      name: "count unique correct matches true if first attempt",
      getId: (): number => soundService.getMainStageItemId(),
      delta: DEFAULT_STAGE_COUNT
    },
    {name: "not increment count on false match", getId: (): number => WRONG_ID, delta: 0},
  ]

  scenarios.forEach(scenario => {
    it(`should ${scenario.name}`, () => {
      const {store} = setupGameState(categoryId);

      for (let stage = 0; stage < DEFAULT_STAGE_COUNT; stage++) {
        soundService.processMatchAttempt(scenario.getId());
      }

      expect(store.firstTryMatch()).toEqual(scenario.delta);
    });
  });

  it('should count unique correct attempt on correct first try', () => {
    const {store} = setupGameState(categoryId);
    const stage = store.currentStage();
    spyOn(store, 'resetStageAttempts').and.callThrough();

    expect(store.currentStage()).toEqual(stage);
    expect(store.attemptsThisStage()).toEqual(0);

    // stage 0: correct on first
    soundService.processMatchAttempt(soundService.getMainStageItemId());
    expect(store.resetStageAttempts).toHaveBeenCalledTimes(1);
    expect(store.firstTryMatch()).toEqual(1);

    // stage 1: wrong then correct
    expect(store.currentStage()).toEqual(stage + 1);
    expect(store.attemptsThisStage()).toEqual(0);
    soundService.processMatchAttempt(WRONG_ID);
    soundService.processMatchAttempt(soundService.getMainStageItemId());

    // stage 2
    expect(store.firstTryMatch()).toEqual(1);
    expect(store.resetStageAttempts).toHaveBeenCalledTimes(2);
    expect(store.currentStage()).toEqual(stage + 2);
  });

  function setupGameState(categoryId: number) {
    const mockWords: WordItem[] = fallbackDataMap[categoryId];
    // Spies setup
    spyOn(catService, 'getAllWordsInGroup').and.returnValue(of(mockWords));
    spyOn(converterService, "wordItemsToMatchItems").and.callThrough();
    spyOn(logicService, 'generateShuffledItemCopy').and.callThrough();
    spyOn(logicService, 'generateItemSlicesForEachStage').and.callThrough();

    soundService.initializeGame(categoryId);

    return {mockWords, store: soundService.getStore()}
  }
});

describe('game completion', () => {
  let soundService: MatchSoundsWordsService;
  let catService: CategoryService;
  let converterService: ItemConverterService;
  let logicService: GameLogicService;

  beforeEach(() => {
    ({soundService, catService, converterService, logicService} = setupMatchSound());
  });

  describe('New categories game', () => {

    it('should handle multiple categories', () => {
      //spy
      spyOn(catService, 'getAllWordsInGroup').and.callFake((id: number) =>
        of(fallbackDataMap[id])
      );

      // setup
      const categories: number[] = [6, 5];
      const store = soundService.getStore();
      const expectedItems: MatchItem[] = categories.flatMap(id => fallbackDataMap[id]);
      // execute
      soundService.newCategoriesGame(categories);

      // assert
      expect(catService.getAllWordsInGroup).toHaveBeenCalledTimes(2);
      expect(store.items().length).toEqual(expectedItems.length);
    });

    it('should do return if empty category array', () => {
      spyOn(catService, 'getAllWordsInGroup').and.callThrough();
      spyOn(soundService, 'setupGame').and.callThrough();

      const categories: number[] = [];
      const store = soundService.getStore();

      soundService.newCategoriesGame(categories);

      expect(catService.getAllWordsInGroup).not.toHaveBeenCalled();
      expect(soundService.setupGame).not.toHaveBeenCalled();
      expect(store.items().length).toEqual(0);
    });

    it('should reset state after selecting new categories game', () => {
      spyOn(soundService, 'setupGame').and.callThrough();
      spyOn(soundService, 'resetGameState').and.callThrough();

      soundService.newCategoriesGame([4]);

      expect(soundService.resetGameState).toHaveBeenCalled();
    });
  });

  describe('Replay', () => {
    const categoryId = 4;

    it('should keep same items but change order', () => { /* spy & expect */
      const firstStage = 0;
      const finalStage = 2;
      const {store} = setupGameState(categoryId);
      const original = store.items();

      reachGameEnd(finalStage);

      expect(store.gameOver()).toBeTrue();
      expectStage(store, finalStage);
      expect(store.mainWords().every(w => w.matched)).toBeTrue();

      // replay
      soundService.replay();

      const replayed = store.items();

      expectStage(store, firstStage);
      expect(replayed.length).toEqual(original.length);
      expect(store.mainWords().some(w => w.matched)).toBeFalse();
      expect(store.gameOver()).toBeFalse();
    });

    it('should reshuffle items on replay', () => {
      //   todo
      //    spy on - reshufffle
    });

    it('should keep same items but in different order', () => {
    });

    function setupGameState(categoryId: number) {
      const mockWords: WordItem[] = fallbackDataMap[categoryId];
      // Spies setup
      spyOn(catService, 'getAllWordsInGroup').and.returnValue(of(mockWords));
      spyOn(converterService, "wordItemsToMatchItems").and.callThrough();
      spyOn(logicService, 'generateShuffledItemCopy').and.callThrough();
      spyOn(logicService, 'generateItemSlicesForEachStage').and.callThrough();

      soundService.initializeGame(categoryId);

      return {mockWords, store: soundService.getStore()}
    }

    function reachGameEnd(finalStage: number) {
      for (let stage = 0; stage <= finalStage; stage++) {
        soundService.processMatchAttempt(soundService.getMainStageItemId());
      }
    }
  });

  describe('New game ( unchanged categories)', () => {
    // TODO
    xit('should allow new game - same category or categories reshuffled', () => {
    });
  });

  describe('Resetting for new round', () => {
    // todo
    xit('should reset current stage', () => {
    });
    xit('should reset matched status on new game, replay and rest', () => {
    });
  });

//   TODO
//    implement and test reset in each game completion
//    notice: replay does not remove game items just reshuffles them
  xit('should reset game state on reset', () => {
  });
});


function setupMatchSound() {
  TestBed.configureTestingModule({
    providers: [
      MatchSoundsWordsService,
      MatchSoundsStore,
      CategoryService,
      ItemConverterService,
      GameLogicService,
      provideHttpClient(),
      provideHttpClientTesting()
    ]
  });
  const catService = TestBed.inject(CategoryService);
  const converterService = TestBed.inject(ItemConverterService);
  const logicService = TestBed.inject(GameLogicService);
  const soundService = TestBed.inject(MatchSoundsWordsService);

  return {soundService, catService, converterService, logicService};
}


function completeCurrentStage(store: MatchSoundsStore): void {
  store.getCurrentMainWord().matched = true;
}

function partlyMatchedCurrentStage(store: MatchSoundsStore) {
  store.getCurrentMainWord().matched = false;
}

function expectStage(store: MatchSoundsStore, expectedStage: number): void {
  expect(store.currentStage()).toEqual(expectedStage);

}
