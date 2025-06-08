import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed} from '@angular/core/testing';

import {of} from 'rxjs';

import {EndGameModalComponent} from '../../../shared/components/end-game-modal/end-game-modal.component';
import {getElementByDataTestId} from '../../../shared/tests/dom-test-utils';
import {MatchWordsGameComponent} from '../match-words-game/match-words-game.component';
import {MatchWordsService} from '../match-words-game/match-words.service';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {VocabularyService} from '../../../shared/services/vocabulary.service';
import {matchItems} from '../../../../assets/test-data/match-items';
import {WikiService} from '../../../shared/services/wiki.service';

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
    let component: MatchWordsGameComponent;

    beforeEach(async () => {
      // todo handle duplicate
      await TestBed.configureTestingModule({
        imports: [MatchWordsGameComponent],
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

      component.gameReady.set(true);
      component.gameOver.set(true); // force modal to show
      fixture.detectChanges();
    });


    it('should call onChangeCategoryClicked when EndGameModal emits changeCategoryClicked', () => {
      const spy = spyOn(component, 'onChooseCategory').and.callThrough();

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

    it('should start new game with chosen categories on clicking OK in category modal', () => {
      //   todo
      //    check start new game on OK
      //    close endgame/reset/whatever pass it on or call in match wordgame
      //    pass the chosen categories to the service


    });

    xit('should close the chooser modal when "cancel" is clicked');
  });
});

// todo connect to dummy vocab service get all categories
xdescribe('Connecting to service', () => {
  xit('Should get all categories', () => {
  });
});

// TODO: Note: probably not in the modal but here as place holder
xdescribe('Processing chosen categories and flow', () => {
  xit('should process single category');
  xit('should throw error when no categories chosen');
  xit('should have default category');
  xit('should process multiple chosen categories');
  xit('should get all category items');
  xit('should concat items from all categories');
  xit('should mix all items from chosen categories on game initialization');

  xit('should handle not enough items in category for default display');
  xit('should handle when not enough items in given category');
  xit('should keep fetched categories in cache(?) for future calls');
  xit('should ');
  xit('should ');


  // todo end to end
  // todo maybe cache in a map <string, item[]>

  xdescribe('Passing categories', () => {
    xit('should keep old fetched categories for this session, not calling again categories already fetched');
    xit('should get categories from service');
    xit('should ');
  });

});
