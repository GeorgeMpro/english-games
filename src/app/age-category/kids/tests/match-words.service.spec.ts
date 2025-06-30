import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {of} from 'rxjs';

import {
  MatchWordsService
} from '../match-words-game/match-words.service';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {VocabularyService} from '../../../shared/services/vocabulary.service';
import {WikiService} from '../../../shared/services/wiki.service';
import {GameLogicService} from '../../../shared/services/game-logic.service';

import {ImageCard, MatchItem, WordCard} from '../../../shared/models/kids.models';
import {matchItems} from '../../../../assets/test-data/match-items';

import {
  DEFAULT_STAGE_COUNT,
  DEFAULT_ITEMS_PER_STAGE,
  MATCH_RESET_TIMEOUT_DELAY, animalsGroup
} from '../../../shared/game-config.constants';

const stages = DEFAULT_STAGE_COUNT;
const itemsPerStage = DEFAULT_ITEMS_PER_STAGE;
const totalItems = stages * itemsPerStage;

describe('MatchWordsService', () => {
  let service: MatchWordsService;
  let store: MatchWordsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MatchWordsService,
        MatchWordsStore,
        {
          provide: VocabularyService,
          useValue: {getList: () => of(matchItems.map(i => i.word))}
        },
        {
          provide: WikiService,
          useValue: {getItems: () => of(structuredClone(matchItems))}
        }
      ]
    });

    service = TestBed.inject(MatchWordsService);
    store = TestBed.inject(MatchWordsStore);
    store.items.set(structuredClone(matchItems));
    store.stageItems.set([
      structuredClone(matchItems.slice(0, itemsPerStage)),
      structuredClone(matchItems.slice(itemsPerStage, 2 * itemsPerStage)),
      structuredClone(matchItems.slice(2 * itemsPerStage, 3 * itemsPerStage)),
    ]);
    store.currentStage.set(0);
  });


  describe('Game Setup', () => {
    it('should setup game data from category', () => {
      service.initializeGameData(animalsGroup).subscribe();
      expect(store.items().length).toBe(matchItems.length);
    });

    it('should initialize game correctly', () => {
      service.initializeGameData(animalsGroup).subscribe();
      service.initializeGamePlay(stages, itemsPerStage);
      expect(store.shuffledItemsSlice().length).toBe(totalItems);
      expect(store.stageItems().length).toBe(stages);
    });
  });


  describe('Stage Management', () => {
    beforeEach(() => {
      service.initializeGameData(animalsGroup).subscribe();
      service.initializeGamePlay(stages, itemsPerStage);
    });


    it('should start at stage 0', () => {
      expect(service.getCurrentStage()).toBe(0);
    });

    it('should return items for current stage', () => {
      const items = service.getCurrentStageItems();
      expect(items.length).toBe(itemsPerStage);
    });

    it('should progress through all stages', () => {
      // todo change stage for human start 1 comp start 0
      for (let i = 0; i < stages - 1; i++) {
        expectStageProgression(service, i);
      }
      expect(service.getCurrentStage()).toBe(stages - 1);
    });
  });


  describe('Matching Logic', () => {
    let item: MatchItem;
    let word: WordCard;
    let image: ImageCard;
    let gameLogicService: GameLogicService;

    beforeEach(() => {
      gameLogicService = TestBed.inject(GameLogicService);

      service.initializeGameData(animalsGroup).subscribe();
      service.initializeGamePlay(stages, itemsPerStage);

      item = service.getCurrentStageItems()[0];
      word = store.wordCards().find(w => w.id === item.id)!;
      image = store.imageCards().find(i => i.id === item.id)!;
    });

    it('should store selected word ID in signal', () => {
      service.handleWordSelection(word);
      expect(store.selectedWordId()).toBe(word.id);
      expect(store.selectedImageId()).toBeUndefined();
    });

    it('should store selected image ID in signal', () => {
      service.handleImageSelection(image);
      expect(store.selectedImageId()).toBe(image.id);
    });

    it('should mark item as matched, reset selected, and set feedback message', fakeAsync(() => {
      service.handleWordSelection(word);
      service.handleImageSelection(image);

      // Matched item should be updated
      const updated = service.getCurrentStageItems().find(i => i.id === item.id);
      expect(updated?.matched).toBeTrue();

      // Message should be shown
      expect(store.matchAttemptMessage()).toBeTruthy();

      // Advance time to trigger resetSelections()
      tick(MATCH_RESET_TIMEOUT_DELAY);

      // Selected IDs should be cleared
      expect(store.selectedWordId()).toBeUndefined();
      expect(store.selectedImageId()).toBeUndefined();
      expect(store.matchAttemptMessage()).toBe('');
    }));


    it('should not attempt a match if only word is selected', () => {
      service.handleWordSelection(word);

      // no image selected, the match shouldn't trigger
      expect(store.matchAttemptMessage()).toBe('');
      expect(store.selectedWordId()).toBe(word.id);
      expect(store.selectedImageId()).toBeUndefined();
    });

    it('should ignore selection if word is already matched', () => {
      word.matched = true;
      service.handleWordSelection(word);

      expect(store.selectedWordId()).toBeUndefined(); // should be ignored
    });

    it('should ignore selection if image is already matched', () => {
      image.matched = true;
      service.handleImageSelection(image);

      expect(store.selectedImageId()).toBeUndefined(); // should be ignored
    });

    it('should not update anything if match result is null', () => {
      spyOn(gameLogicService, 'tryMatchResult').and.returnValue(null);

      service.handleWordSelection(word);
      service.handleImageSelection(image);

      expect(store.matchAttemptMessage()).toBe('');
      expect(service.getCurrentStageItems().find(i => i.id === item.id)?.matched).toBeFalse();
    });

    it('should update store and schedule reset when a correct match is detected', () => {
      const result = {
        updatedWords: [word],
        updatedImages: [image],
        message: 'Great!'
      };
      spyOn(gameLogicService, 'tryMatchResult').and.returnValue(result);
      const updateValuesSpy = spyOn(service as any, 'updateValues').and.callThrough();
      const resetSpy = spyOn(service as any, 'executeReset').and.callThrough();

      service.handleWordSelection(word);
      service.handleImageSelection(image);

      expect(updateValuesSpy).toHaveBeenCalledWith(result);
      expect(resetSpy).toHaveBeenCalled();
    });


    it('should not reset selections if no match result is detected', fakeAsync(() => {
      spyOn(service as any, 'getMatchResult').and.returnValue(null);
      const resetSpy = spyOn(service as any, 'executeReset').and.callThrough();

      service.handleWordSelection(word);
      service.handleImageSelection(image);

      // No match result, reset should not be called
      expect(resetSpy).not.toHaveBeenCalled();
      expect(store.selectedWordId()).toBe(word.id);
      expect(store.selectedImageId()).toBe(image.id);
    }));

    it('should reset selections if a valid match result is detected', fakeAsync(() => {
      const result = {
        updatedWords: [word],
        updatedImages: [image],
        message: 'Great!'
      };
      spyOn(service as any, 'getMatchResult').and.returnValue(result);
      const resetSpy = spyOn(service as any, 'executeReset').and.callThrough();

      service.handleWordSelection(word);
      service.handleImageSelection(image);

      // Valid match result, reset should be called
      expect(resetSpy).toHaveBeenCalled();
      tick(MATCH_RESET_TIMEOUT_DELAY);
      expect(store.selectedWordId()).toBeUndefined();
      expect(store.selectedImageId()).toBeUndefined();
    }));
  });
});

function markAllAsMatched(items: MatchItem[]) {
  items.forEach(item => {
    item.matched = true;
  });
}

function expectStageProgression(service: MatchWordsService, previousStage: number) {
  const currentItems = service.getCurrentStageItems();
  markAllAsMatched(currentItems);

  service.progressGameIfStageComplete();

  const nextItems = service.getCurrentStageItems();
  expect(service.getCurrentStage()).toBe(previousStage + 1);
  expect(nextItems).not.toEqual(currentItems);
  expect(nextItems.every(i => i.matched)).toBeFalse();
}
