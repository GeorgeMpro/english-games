import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {of} from 'rxjs';

import {MatchSoundsWordsService} from './match-sounds-words.service';
import {CategoryService} from '../../../../data-access/category.service';
import {fallbackDataMap} from '../../match-words-game/category-json-mapper';
import {WordItem} from '../../../../data-access/api.models';

describe('MatchSoundsWordsService', () => {
  let soundService: MatchSoundsWordsService;
  let catService: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MatchSoundsWordsService,
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    soundService = TestBed.inject(MatchSoundsWordsService);
    catService = TestBed.inject(CategoryService);
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
  let soundService: MatchSoundsWordsService;
  let catService: CategoryService;

  beforeEach(() => {
    ({soundService, catService} = setupMatchSound());
  });

  it('should fetch and store all chosen category items when initializing', () => {
    const categoryId = 4;
    const mockWords: WordItem[] = fallbackDataMap[categoryId];
    const store = soundService.getStore();

    spyOn(catService,'getAllWordsInGroup').and.returnValue(of(mockWords));

    // todo update to num | num[]
    soundService.initializeGame(categoryId);
    expect(store.wordsFromChosenCategories()).toEqual(mockWords);
    expect(catService.getAllWordsInGroup).toHaveBeenCalledWith(categoryId);


  });

  xit('should shuffle chosen categories', () => {
  });
  xit('should get shuffled items slice', () => {
  });

  xit('should setup game items - items per stage', () => {
  });


  xit('should setup game items - main word for stage', () => {
  });

  xit('should not repeat main word - if possible', () => {
  });

  xit('should not progress if not all items are matched', () => {
  });

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
      CategoryService,
      provideHttpClient(),
      provideHttpClientTesting()
    ]
  });
  const soundService = TestBed.inject(MatchSoundsWordsService);
  const catService = TestBed.inject(CategoryService);
  return {soundService, catService};
}

