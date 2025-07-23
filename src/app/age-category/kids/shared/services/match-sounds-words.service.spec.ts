import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {of} from 'rxjs';

import {MatchSoundsWordsService} from './match-sounds-words.service';
import {CategoryService} from '../../../../data-access/category.service';
import {fallbackDataMap} from '../../match-words-game/category-json-mapper';
import {WordItem} from '../../../../data-access/api.models';
import {MatchSoundsStore} from '../../match-sounds-game/match-sounds.store';
import {ItemConverterService} from '../../../../shared/services/item-converter.service';
import {GameLogicService} from '../../../../shared/services/game-logic.service';
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
  xit('should handle empty category - display that the category is not available at the moment', () => {
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

  it(' should advance stages until game finishes, should not advance after game is complete', () => {
    //   game start
    const {store} = setupGameState(categoryId);
    expect(store.currentStage()).toEqual(0);

    //   advance stage
    soundService.progressStage();
    expect(store.currentStage()).toEqual(1);

    soundService.progressStage();
    soundService.progressStage();

    //   game end
    expect(store.currentStage()).toEqual(DEFAULT_STAGE_COUNT - 1);
    expect(store.gameOver()).toBeTruthy();

    // stop advancing levels
    soundService.progressStage();
    expect(store.currentStage()).toEqual(DEFAULT_STAGE_COUNT-1);
  });
  xit('should advance stage if stage complete', () => {
  });

  xit('should end game when finish final stage', () => {
  });


  xit('should setup game items - main word for stage', () => {
  });

  xit('should not repeat main word - if possible', () => {
  });

  xit('should not progress if not all items are matched', () => {
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

  xit('should reset on false match', () => {
  });
  xit('should count unique ( first time) attempts to match', () => {
  });
  xit('should update "matched" and make the matched unplayable', () => {
  });
});

describe('game completion', () => {

  xit('should allow replay - same items re-shuffled', () => {
  });
  xit('should allow new game - same category or categories reshuffled', () => {
  });
  xit('should display end game modal and statistics', () => {
  });

});
describe('display', () => {
  xit('should display game cards with pastel colors');
  xit('should update "matched/unmatched" classes');


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

