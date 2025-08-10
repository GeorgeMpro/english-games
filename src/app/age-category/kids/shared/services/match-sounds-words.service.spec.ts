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

  // todo add the sentence to speak it
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
    // TODO
    //  notice - use *paginate to advance stages
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
      let stages: number = DEFAULT_STAGE_COUNT

      // todo
      it('should finish stage when all matched', () => {
        const {mockWords, store} = setupGameState(categoryId);
        const start = store.currentStage();
        const stageItems = store.currentStageItems();

        expect(start).toEqual(0);
        expect(stageItems.every(item => !item.matched)).toBeTrue();

        //   act
        completeCurrentStage(store);
        expect(store.currentStageItems().length).toBeGreaterThan(0);
        expect(store.currentStageItems().every(i => i.matched)).toBeTrue(); // <-- this is false now

        store.progressStage()
        expect(store.currentStage()).toEqual(start + 1);
      });

      it('should not progress if not all items are matched', () => {
        const store = soundService.getStore();
        const start = store.currentStage();
        const stageItems = store.currentStageItems();

        expect(start).toEqual(0);

        stageItems.forEach(item => item.matched = false);
        store.progressStage()
        expect(store.currentStage()).toEqual(0);

      });

      xit('should advance stage if stage complete', () => {

      });

      xit('should end game when finish final stage', () => {
      });

      xit('should reset main words - on game end', () => {
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

  // todo
  xit('should reset on false match', () => {
  });
  xit('should count unique ( first time) attempts to match', () => {
  });
  xit('should update "matched" and make the matched unplayable', () => {
  });
});

describe('game completion', () => {
  const categoryId = 4;
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

      const store = soundService.getStore();

      soundService.newCategoriesGame([4]);

      expect(soundService.resetGameState).toHaveBeenCalled();
    });
  });

  describe('Replay', () => {

    it('should allow replay - same items re-shuffled', () => {

      //   todo
      //    spy on replay
      //    reset match state
      //    spy on re-shuffle
      //      re-shuffle the same stage*per stage items

    });
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


describe('display', () => {
  xit('should display game cards with pastel colors');
  xit('should update "matched/unmatched" classes');
  xit('should display end game modal and statistics', () => {
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
  store.currentStageItems().every(item => item.matched = true);
}
