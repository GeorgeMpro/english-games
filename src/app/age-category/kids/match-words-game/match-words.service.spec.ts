import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {of} from 'rxjs';

import {
  DEFAULT_ITEMS_PER_STAGE,
  DEFAULT_STAGE_COUNT,
  MATCH_RESET_TIMEOUT,
  MatchWordsService
} from './match-words.service';
import {MatchWordsStore} from './match-words.store';
import {VocabularyService, Category} from '../../../shared/services/vocabulary.service';
import {WikiService} from '../../../shared/services/wiki.service';
import {GameLogicService} from '../../../shared/services/game-logic.service';

import {ImageCard, MatchItem, WordCard} from '../../../shared/models/kids.models';
import {matchItems} from '../../../../assets/test-data/match-items';

const stages = DEFAULT_STAGE_COUNT;
const itemsPerStage = DEFAULT_ITEMS_PER_STAGE;
const totalItems = stages * itemsPerStage;

function markAllAsMatched(items: MatchItem[]) {
  items.forEach(item => {
    item.matched = true;
  });
}

function expectStageProgression(service: MatchWordsService, previousStage: number) {
  const currentItems = service.getCurrentStageItems();
  markAllAsMatched(currentItems);

  service.progressIfStageComplete();

  const nextItems = service.getCurrentStageItems();
  expect(service.getCurrentStage()).toBe(previousStage + 1);
  expect(nextItems).not.toEqual(currentItems);
  expect(nextItems.every(i => i.matched)).toBeFalse();
}

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
  });

  describe('Game Setup', () => {
    it('should setup game data from category', (done) => {
      service.initializeGameData(Category.Animals).subscribe(success => {
        expect(success).toBeTrue();
        expect(store.items().length).toBe(matchItems.length);
        done();
      });
    });

    it('should initialize game correctly', (done) => {
      service.initializeGameData(Category.Animals).subscribe(() => {
        service.initializeGamePlay(stages, itemsPerStage);
        expect(store.shuffledItemsSlice().length).toBe(totalItems);
        expect(store.stageItems().length).toBe(stages);
        done();
      });
    });
  });

  describe('Stage Management', () => {
    beforeEach((done) => {
      service.initializeGameData(Category.Animals).subscribe(() => {
        service.initializeGamePlay(stages, itemsPerStage);
        done();
      });
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

    beforeEach((done) => {
      gameLogicService = TestBed.inject(GameLogicService);

      service.initializeGameData(Category.Animals).subscribe(() => {
        service.initializeGamePlay(stages, itemsPerStage);
        item = service.getCurrentStageItems()[0];
        word = store.wordCards().find(w => w.id === item.id)!;
        image = store.imageCards().find(i => i.id === item.id)!;
        done();
      });
    });

    it('should store selected word ID in signal', () => {
      service.selectWord(word);
      expect(store.selectedWordId()).toBe(word.id);
      expect(store.selectedImageId()).toBeUndefined();
    });

    it('should store selected image ID in signal', () => {
      service.selectImage(image);
      expect(store.selectedImageId()).toBe(image.id);
    });

    it('should mark item as matched, reset selected, and set feedback message', fakeAsync(() => {
      service.selectWord(word);
      service.selectImage(image);

      // Matched item should be updated
      const updated = service.getCurrentStageItems().find(i => i.id === item.id);
      expect(updated?.matched).toBeTrue();

      // Message should be shown
      expect(store.matchAttemptMessage()).toBeTruthy();

      // Advance time to trigger resetSelections()
      tick(MATCH_RESET_TIMEOUT);

      // Selected IDs should be cleared
      expect(store.selectedWordId()).toBeUndefined();
      expect(store.selectedImageId()).toBeUndefined();
      expect(store.matchAttemptMessage()).toBe('');
    }));


    it('should not attempt a match if only word is selected', () => {
      service.selectWord(word);

      // no image selected, the match shouldn't trigger
      expect(store.matchAttemptMessage()).toBe('');
      expect(store.selectedWordId()).toBe(word.id);
      expect(store.selectedImageId()).toBeUndefined();
    });

    it('should ignore selection if word is already matched', () => {
      word.matched = true;
      service.selectWord(word);

      expect(store.selectedWordId()).toBeUndefined(); // should be ignored
    });

    it('should ignore selection if image is already matched', () => {
      image.matched = true;
      service.selectImage(image);

      expect(store.selectedImageId()).toBeUndefined(); // should be ignored
    });

    it('should not update anything if match result is null', () => {
      spyOn(gameLogicService, 'tryMatchResult').and.returnValue(null);

      service.selectWord(word);
      service.selectImage(image);

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

      service.selectWord(word);
      service.selectImage(image);

      expect(updateValuesSpy).toHaveBeenCalledWith(result);
      expect(resetSpy).toHaveBeenCalled();
    });
  });


  describe('Replay & Reset (TODO)', () => {
    xit('should reshuffle and reuse same items', () => {
    });
    xit('should reset game fully with same category', () => {
    });
  });

  describe('Feedback & Completion (TODO)', () => {
    xit('should track correct and incorrect matches', () => {
    });
    xit('should finish game when all stages complete', () => {
    });
  });
})
;
