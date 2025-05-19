import {TestBed} from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

import {of} from 'rxjs';

import {MatchWordsService} from '../match-words-game/match-words.service';
import {Category, VocabularyService} from '../../../shared/services/vocabulary.service';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {WikiService} from '../../../shared/services/wiki.service';

import {matchItems} from '../../../../assets/test-data/match-items';
import {DEFAULT_ITEMS_PER_STAGE, DEFAULT_STAGE_COUNT} from '../../../shared/game-config.constants';

const stages = DEFAULT_STAGE_COUNT;
const itemsPerStage = DEFAULT_ITEMS_PER_STAGE;

describe('Feedback functionality', () => {
  let service: MatchWordsService;
  let store: MatchWordsStore;

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
    service.initializeGameData(Category.Animals).subscribe(() => {
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

    xit('should ignore repeated attempts on the same image');

    xit('should return correct unique matches out of total items');
    xit('should reset attempt map on new game');
    xit('should reset attempt map on replay');

  });

  xdescribe('user feedback', () => {

    xit('should display number of unique correct attempts');
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

function setUserSelectedImageAndWordCard(store: MatchWordsStore, imgId: number, wordId: number) {
  store.selectedImageId.set(imgId);
  store.selectedWordId.set(wordId);
}
