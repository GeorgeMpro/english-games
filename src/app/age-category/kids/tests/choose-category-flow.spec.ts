import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

import {of} from 'rxjs';

import {EndGameModalComponent} from '../../../shared/components/end-game-modal/end-game-modal.component';
import {
  clickButtonByTestId,
  getElementByDataTestId,
  setupOpenChosenCategoryModal,
  triggerNewGameWithSelectedCategories
} from '../../../shared/tests/dom-test-utils';
import {MatchWordsGameComponent} from '../match-words-game/match-words-game.component';
import {setupMatchComponent, setupMatchWordComponent, setupMatchWordComponentEndGameState} from './test-setup-util';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {MatchWordsService} from '../match-words-game/match-words.service';
import {Category, VocabularyService} from '../../../shared/services/vocabulary.service';
import {GameLogicService} from '../../../shared/services/game-logic.service';
import {WikiService} from '../../../shared/services/wiki.service';
import {MatchItem} from '../../../shared/models/kids.models';


describe('Choose category flow', () => {

  describe('Choose button in End Game modal', () => {
    let fixture: ComponentFixture<EndGameModalComponent>;
    let chooseBtn: HTMLButtonElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [EndGameModalComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(EndGameModalComponent);
      fixture.detectChanges();

      chooseBtn = getElementByDataTestId(fixture, 'choose-button');
    });

    it('should have a choose button', () => {
      expect(chooseBtn).toBeTruthy();
      expect(chooseBtn.textContent?.toLowerCase()).toContain('change categories');
    });
  });

  describe('Displaying modal', () => {
    let fixture: ComponentFixture<MatchWordsGameComponent>;

    beforeEach(async () => {
      fixture = await setupMatchWordComponentEndGameState();
    });


    it('should call onChangeCategoryClicked when EndGameModal emits changeCategoryClicked', () => {
      const spy = spyOn(fixture.componentInstance, 'onChooseCategory').and.callThrough();

      const endModal = getElementByDataTestId(fixture, 'end-game-modal');
      const chooseBtn = endModal.querySelector('[data-testid="choose-button"]') as HTMLButtonElement;

      chooseBtn.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });

    it('should open category chooser modal when clicking on "choose category"', () => {
      // should be hidden by default
      expect(getElementByDataTestId(fixture, 'category-chooser-modal')).toBeNull();

      const endModal = getElementByDataTestId(fixture, 'end-game-modal');
      const chooseBtn = endModal.querySelector('[data-testid="choose-button"]') as HTMLButtonElement;

      chooseBtn.click();
      fixture.detectChanges();

      const chooseModal = getElementByDataTestId(fixture, 'category-chooser-modal');
      expect(chooseModal).toBeTruthy();
    });

    it('should pass chosen categories to the service and start a new game on New Game clicked', async () => {
      const {
        modalInstance, spy
      } = await triggerNewGameWithSelectedCategories(fixture, 'category-chooser-modal');

      expect(spy).toHaveBeenCalledOnceWith(['Animals', 'Colors']);
      expect(modalInstance.isVisible()).toBeFalse();
    });


    it('should close the chooser modal when "cancel" is clicked', () => {
      const modal = setupOpenChosenCategoryModal(fixture);
      clickButtonByTestId(fixture, 'cancel-button', true);

      expect(modal.isVisible()).toBeFalse();
    });


  });
});

describe('Category chooser modal before game end', () => {

  let fixture: ComponentFixture<MatchWordsGameComponent>;

  beforeEach(async () => {
    fixture = await setupMatchWordComponent();
  });

  it('should open modal on match component', () => {

    const spy = spyOn(fixture.componentInstance, 'onChooseCategory').and.callThrough();
    expect(getElementByDataTestId(fixture, 'category-chooser-modal')).toBeNull();

    clickButtonByTestId(fixture, 'choose-in-match-button');
    fixture.detectChanges();

    expect(getElementByDataTestId(fixture, 'category-chooser-modal')).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });
});

describe('Processing chosen categories and flow', () => {
  let fixture: ComponentFixture<MatchWordsGameComponent>;
  let component: MatchWordsGameComponent;
  let service: MatchWordsService;

  beforeEach(async () => {
    ({fixture, component, service} = await setupMatchComponent());

    component.gameReady.set(true);
    fixture.detectChanges();
  });

  describe('Category flow integration', () => {
    it('should reset game state on new game from choose category New Game', () => {
      component.gameOver.set(true);

      const resetSpy = spyOn(service, 'resetGameState').and.callThrough();

      // call with dummy categories
      component.onNewGameWithCategories(['Animals', 'Clothes']);

      expect(component.gameOver()).toBeFalse();
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should delegate new category handling to the service', () => {
      spyOn(service, 'handleNewCategoriesGame'); // or whatever method you wire
      component.onNewGameWithCategories(['Animals', 'Clothes']);
      expect(service.handleNewCategoriesGame).toHaveBeenCalledWith(['Animals', 'Clothes'])
    });
  });
});

describe('Chosen categories service interaction', () => {

  describe('Proper flow', () => {

    const categories = ['animals', 'clothes', 'colors'];
    const fakeWikiReturnItems: MatchItem[] = [
      {id: 1, word: 'dog', imageUrl: 'img1', wikiUrl: 'url1', matched: false},
      {id: 2, word: 'cat', imageUrl: 'img2', wikiUrl: 'url2', matched: false},
      {id: 3, word: 'red', imageUrl: 'img3', wikiUrl: 'url3', matched: false}
    ];

    let wordsService: MatchWordsService;
    let vocabService: VocabularyService;
    let wikiService: WikiService;

    let store: MatchWordsStore;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          MatchWordsStore,
          GameLogicService,
          VocabularyService,
          WikiService,
          MatchWordsService,
          provideHttpClient(),
          provideHttpClientTesting(),
        ]
      })

      wordsService = TestBed.inject(MatchWordsService);
      vocabService = TestBed.inject(VocabularyService);
      wikiService = TestBed.inject(WikiService);
      store = TestBed.inject(MatchWordsStore);
    });

    it('should attempt to get items for passed category', () => {
      const spy = spyOn(vocabService, 'getList').and.returnValue(of([]));
      wordsService.handleNewCategoriesGame(categories);

      expect(spy.calls.count()).toBe(categories.length);
      categories.forEach((category: string, i: number) => {
        expect(spy.calls.argsFor(i)).toEqual([category as Category])
      })
    });

    it('should create items from merged item list', fakeAsync(() => {
      const expectedList = ['dog', 'cat', 'red', 'yellow', 'pants', 'shoes']
      // todo: simplify?
      spyOn(vocabService, 'getList').and.callFake((cat: Category) => {
        switch (cat) {
          case Category.Animals:
            return of(['dog', 'cat']);
          case Category.Clothes:
            return of(['pants', 'shoes']);
          case Category.Colors:
            return of(['red', 'yellow']);
          default:
            return of([]);
        }
      });

      wordsService.handleNewCategoriesGame(categories);
      tick();

      expectedList.forEach((word: string) => {
        expect(store.wordsFromChosenCategories()).toContain(word);
      });
    }));

    it('should generate items from chosen categories and initialize gameplay', () => {
      store.wordsFromChosenCategories.set(categories);
      const spyWiki =
        spyOn(wikiService, 'getItems').and.returnValue(of(fakeWikiReturnItems));
      const spyInitPlay = spyOn(wordsService, 'initializeGamePlay');

      wordsService.startGameFromChosenCategories();

      expect(spyWiki).toHaveBeenCalledOnceWith(categories);
      expect(store.items()).toEqual(fakeWikiReturnItems);
      expect(spyInitPlay).toHaveBeenCalled();
    });

    it('should assign unique IDs to all items when merging multiple categories', fakeAsync(() => {
      spyOn(vocabService, 'getList').and.callFake((cat: Category) => {
        switch (cat) {
          case Category.Animals:
            return of(['bee', 'dog']);
          case Category.Clothes:
            return of(['hat', 'shirt']);
          case Category.Colors:
            return of(['red', 'blue']);
          default:
            return of([]);
        }
      });

      // simulate duplicated ids from wikiService
      spyOn(wikiService, 'getItems').and.callFake((words: string[]) => {
        const duplicatedIdItems: MatchItem[] = words.map((word, i) => ({
          id: i % 2, // force duplicates like id=0,1,0,1...
          word,
          imageUrl: `img-${word}`,
          wikiUrl: `wiki-${word}`,
          matched: false,
        }));
        return of(duplicatedIdItems);
      });

      wordsService.handleNewCategoriesGame(categories);
      tick();

      const ids = store.items().map(item => item.id);
      const unique = new Set(ids);

      expect(unique.size)
        .withContext('All match items must have unique IDs after merging categories')
        .toBe(ids.length);
    }));
  });


  xdescribe('Fallbacks and validation', () => {
    xit('should process single category');
    xit('should throw error when no categories chosen');
    xit('should fall back to default category');
    xit('should handle not enough items in category');
    xit('should handle when chosen categories don’t meet game requirements');
    // todo: connect MatchWordsGameComponent's onNewGameWithCategories with fake chooser
    xit('should handle empty categories as normal new game');
    xit('should pass category array to service');
    xit('should generate the items from each category and concat them');
    xit('should shuffle the concatenated items into game cards');

    xit('should ignore unknown categories', () => {
    });
    xit('should skip categories with no items', () => {
    });
    xit('should log or show error if all fetches fail', () => {
    });
  });

  xdescribe('Connecting to service', () => {
    xit('should get all categories');
  });

  xdescribe('Caching and reuse', () => {
    xit('should keep fetched categories in cache for session');
    xit('should avoid re-fetching cached categories');
  });

});

