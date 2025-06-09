import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatChipOptionHarness} from '@angular/material/chips/testing';

import {EndGameModalComponent} from '../../../shared/components/end-game-modal/end-game-modal.component';
import {getElementByDataTestId} from '../../../shared/tests/dom-test-utils';
import {MatchWordsGameComponent} from '../match-words-game/match-words-game.component';
import {setupMatchWordComponentEndGameState} from './test-setup-util';
import {
  CategoryChooserModalComponent
} from '../../../shared/components/category-chooser-modal/category-chooser-modal.component';


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
      ({fixture, component} = await setupMatchWordComponentEndGameState());
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

    it('should pass chosen categories to the service and start a new game on New Game clicked', async () => {

      // open modal
      component.onChooseCategory();
      fixture.detectChanges();

      // get the modal host element
      const modalElement = getElementByDataTestId(fixture, 'category-chooser-modal');

      // set available categories
      const modalInstance = fixture.debugElement
        .query(By.directive(CategoryChooserModalComponent))
        .componentInstance as CategoryChooserModalComponent;

      modalInstance.availableCategories = ['Animals', 'Colors'];
      fixture.detectChanges();

      // use a documentRootLoader and scope it to the modal element
      const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
      const chips = await loader.getAllHarnesses(
        MatChipOptionHarness.with({ancestor: '[data-testid="category-chooser-modal"]'})
      );

      // toggle
      await chips[0].toggle();
      await chips[1].toggle();


      const spy = spyOn(component, 'onNewGameWithCategories').and.callThrough();

      const okBtn = getElementByDataTestId(fixture, 'new-categories-game-button') as HTMLButtonElement;
      expect(okBtn.disabled).toBeFalse();
      okBtn.click();


      expect(spy).toHaveBeenCalledOnceWith(['Animals', 'Colors']);
      expect(modalInstance.isVisible()).toBeFalse();

//   todo
//   - setup end game state, open choose category modal
//   - setup available categories and select via toggle
//         make sure button is not disabled
//   - ensure New Game button is enabled
//   - click New Game
//   - expect onNewGameWithCategories to be called with selected categories
//   - expect end modal and chooser modal to be closed/reset


    });

    xit('should close the chooser modal when "cancel" is clicked');
  });

  xit('should reset game state on new game from choose category New Game');
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
