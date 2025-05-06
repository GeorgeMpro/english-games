import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {MatchWordsService} from './match-words.service';
import {matchItems} from '../../../../assets/test-data/match-items';
import {Category} from '../../../shared/services/vocabulary.service';
import {MatchWordsStore} from './match-words.store';
import {MatchItem} from '../../../shared/models/kids.models';

// TODO
// does not display image & word if does not load an image
// after match cannot press image & word
// can count right/wrong tries


describe('MatchWordsService', () => {
  let store: MatchWordsStore;
  let service: MatchWordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MatchWordsService,
        MatchWordsStore
      ]
    });
    service = TestBed.inject(MatchWordsService);
    store = TestBed.inject(MatchWordsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should slice game items into stages*items per stage (assume 3 stage and 6 items per stage)', () => {

    const stages = 3;
    const itemsPerStage = 6;
    const totalItemsForGame = stages * itemsPerStage;
    let expected: MatchItem[];
    let expectedStageItems: MatchItem[][];

    beforeEach(() => {
      store.items.set(matchItems);
      service.initializeShuffledItemsSlice(stages, itemsPerStage);
      service.initializeItemsForStage(stages, itemsPerStage);
      expected = store.shuffledItemsSlice();
      expectedStageItems = store.stageItems();
    });

    it('should load animals match items', () => {
      service.setupGameItems(Category.Animals);
      // todo del?
      expect(store.items().length).toBe(matchItems.length);
    });

    it('should slice game items into stages*items per stage', () => {
      expect(expected.length).toBe(totalItemsForGame);
    });

    it('should return shuffled game items slice', () => {
        const actual = matchItems.slice(0, totalItemsForGame);
        expect(expected).not.toEqual(actual);
      }
    );

    it('should contain only IDs from the original matchItems, in shuffled order', () => {
      const shuffledIds = expected.map(i => i.id).sort();
      const originalIds = matchItems.map(i => i.id).sort();

      // Confirm all shuffled items come from the original full list
      shuffledIds.forEach(id => {
        expect(originalIds).toContain(id);
      });

      // Confirm the order is actually different (not trivially equal)
      const shuffledAsSlice = expected.map(i => i.id);
      const originalAsSlice = matchItems.map(i => i.id);
      expect(shuffledAsSlice).not.toEqual(originalAsSlice);
    });


    it('should separate items into equal items per stage', () => {
      const [a, b, c]: MatchItem[][] = expectedStageItems;
      expect(a.length + b.length + c.length).toBe(stages * itemsPerStage);
      expect(a.length).toBe(itemsPerStage);
      expect(b.length).toBe(itemsPerStage);
      expect(c.length).toBe(itemsPerStage);
      expect(a).not.toEqual(b);
      expect(b).not.toEqual(c);
      expect(a).not.toEqual(c);
    });


    it('should extract items for each stage', () => {
      const actual = service.getItemsForStages();

      expect(actual.length).toBe(stages);
      expectedStageItems.forEach((expectedItems, i) => {
        expect(actual[i].index).toBe(i);
        expect(actual[i].items).toEqual(expectedItems);
      });
    });


    xit('should progress stages after completion');
    xit('should reply same items after completion');
    xit('should reset entire game after completion');
  });

});

