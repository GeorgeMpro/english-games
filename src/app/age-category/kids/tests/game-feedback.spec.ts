import {ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed} from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

import {of} from 'rxjs';

import {MatchWordsService} from '../match-words-game/match-words.service';
import {VocabularyService} from '../../../shared/services/vocabulary.service';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {WikiService} from '../../../shared/services/wiki.service';

import {matchItems} from '../../../../assets/test-data/match-items';
import {animalsGroup, DEFAULT_ITEMS_PER_STAGE, DEFAULT_STAGE_COUNT} from '../../../shared/game-config.constants';
import {getElementByDataTestId} from '../../../shared/tests/dom-test-utils';
import {MatchWordsGameComponent} from '../match-words-game/match-words-game.component';

const stages = DEFAULT_STAGE_COUNT;
const itemsPerStage = DEFAULT_ITEMS_PER_STAGE;


describe('Feedback functionality', () => {
  let service: MatchWordsService;
  let store: MatchWordsStore;

  // todo extract setup in multiple files
  beforeEach((done) => {
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
    store.stageItems.set([structuredClone(matchItems.slice(0, 6)), structuredClone(matchItems.slice(6, 12))]);
    store.currentStage.set(0);
    service.initializeGameData(animalsGroup).subscribe(() => {
      service.initializeGamePlay(stages, itemsPerStage);
      done();
    });
  });

  describe('match attempt counter', () => {
    let id: number;
    beforeEach(() => {
      const [item] = store.stageItems()[0];
      id = item.id;
    });
    it('should have correct first try when correct on first try', () => {
      // manually set matching id's
      setUserSelectedImageAndWordCard(store, id, id);

      expect(service.getMatchAttemptById(id)).not.toBeDefined();

      // manually execute `processMatchAttempt`
      service['processMatchAttempt']();

      expect(service.getMatchAttemptById(id)).toBeDefined();
      expect(service.getMatchAttemptById(id)?.attempts).toBe(1);
      expect(service.getMatchAttemptById(id)?.correctOnFirstTry).toBe(true);
    });

    it('should set false when matched on a non-first attempt', () => {
      // manually non-matching id's
      setUserSelectedImageAndWordCard(store, id, id + 1);

      // manually execute `processMatchAttempt`
      service['processMatchAttempt']();
      expect(service.getMatchAttemptById(id)).toBeDefined();

      // manually set matching id's
      setUserSelectedImageAndWordCard(store, id, id);

      service['processMatchAttempt']();
      expect(service.getMatchAttemptById(id)?.attempts).toBe(2);
      expect(service.getMatchAttemptById(id)?.correctOnFirstTry).toBeFalse();
    });

    it('should not set false on multiple attempts on correct unique match', () => {
      [1, 1].forEach(id => simulateMultipleIdMatch(service, store, id, id));
      expect(service.countUniqueCorrect()).toBe(1);
      expect(store.uniqueCorrectMatchAttemptCounter().size).toBe(1);
    });

    it('should return correct unique matches out of total items', () => {
      const ids = [1, 2, 3, 4, 5];
      const incorrect = [6, 7, 8];
      assertUniqueMatchCount(service, store, ids, incorrect);
    });

    it('should reset attempt map on new game', () => {

      simulateInputAndReset(service, store, 'newGame');

      expect(store.uniqueCorrectMatchAttemptCounter().size).toBe(0);
    });

    it('should reset attempt map on replay', () => {
      simulateInputAndReset(service, store, 'replayGame');
      expect(store.uniqueCorrectMatchAttemptCounter().size).toBe(0);
    });
  });

  xdescribe('user feedback', () => {

    xit('should display attempts on game end', () => {

    });
    xit('should display an end game message');
    xit('should give random encouraging message depending on level');
    xit('should render stars or visual rating as feedback');


  });

  xdescribe('Post-Game Options Modal', () => {

    xit('should allow replaying the game');
    xit('should allow starting a new game');
    xit('should reset game state on replay');
    xit('should prevent interaction while modal is open');
  });
});

describe('MatchWordsGameComponent - End Game Feedback', () => {
  let fixture: ComponentFixture<MatchWordsGameComponent>;
  let component: MatchWordsGameComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MatchWordsGameComponent], // standalone
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
      ],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    });

    fixture = TestBed.createComponent(MatchWordsGameComponent);
    component = fixture.componentInstance;
    const [deferBlock] = await fixture.getDeferBlocks();
    await deferBlock.render(DeferBlockState.Complete);
    fixture.detectChanges();
  });

  it('should display correct attempts in modal on game over', () => {
    const store = TestBed.inject(MatchWordsStore);
    const service = TestBed.inject(MatchWordsService);

    // Simulate game progression
    [1, 2, 3].forEach(id => simulateMultipleIdMatch(service, store, id, id)); // 3 correct
    [4, 5].forEach(id => simulateMultipleIdMatch(service, store, id, id + 1)); // 2 wrong

    // Simulate game over state
    component['gameOver'].set(true); // or whatever triggers the modal
    fixture.detectChanges();

    // Assert via test id
    const correctEl = getElementByDataTestId(fixture, 'correct-count');
    const totalEl = getElementByDataTestId(fixture, 'total-count');

    expect(correctEl.textContent).toContain('3');
    expect(totalEl.textContent).toContain('5');
  });
});

/**
 * Manually sets the selected image and word card IDs in the store.
 *
 * @param store - The `MatchWordsStore` instance.
 * @param imgId - The ID of the selected image card.
 * @param wordId - The ID of the selected word card.
 */
function setUserSelectedImageAndWordCard(store: MatchWordsStore, imgId: number, wordId: number) {
  store.selectedImageId.set(imgId);
  store.selectedWordId.set(wordId);
}

function assertUniqueMatchCount(service: MatchWordsService, store: MatchWordsStore, correctIds: number[], incorrect: number[]) {
  // simulate `ids.length` correct unique matches
  correctIds.forEach((id) => simulateMultipleIdMatch(service, store, id, id));

  // simulate incorrect matches
  incorrect.forEach((id) => simulateMultipleIdMatch(service, store, id, id + 1));

  // verify map contains `ids.length` entries with `correctOnFirstTry` set true
  expect(service.countUniqueCorrect()).toBe(correctIds.length);
  expect(store.uniqueCorrectMatchAttemptCounter().size).toBe(correctIds.length + incorrect.length);
}

/**
 * Simulates multiple match attempts for a given image and word ID pair.
 *
 * @param service - The `MatchWordsService` instance.
 * @param store - The `MatchWordsStore` instance.
 * @param imageId - The ID of the image card to match.
 * @param wordId - The ID of the word card to match.
 */
function simulateMultipleIdMatch(
  service: MatchWordsService,
  store: MatchWordsStore,
  imageId: number,
  wordId: number) {
  setUserSelectedImageAndWordCard(store, imageId, wordId);
  service['processMatchAttempt']();
}

function simulateInputAndReset(
  service: MatchWordsService,
  store: MatchWordsStore,
  resetFunction: keyof MatchWordsService) {
  [1, 2, 3, 4].forEach(id => simulateMultipleIdMatch(service, store, id, id));
  [5, 6, 7].forEach(id => simulateMultipleIdMatch(service, store, id, id + 1));

  // simulate resetting game state
  (service[resetFunction] as Function)();
}
