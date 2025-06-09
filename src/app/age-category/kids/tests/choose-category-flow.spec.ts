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
      const {
        modalInstance, spy
      } = await triggerNewGameWithSelectedCategories(component, fixture, 'category-chooser-modal');

      expect(spy).toHaveBeenCalledOnceWith(['Animals', 'Colors']);
      expect(modalInstance.isVisible()).toBeFalse();
    });

    it('should close the chooser modal when "cancel" is clicked', () => {
      const modal = setupOpenChosenCategoryModal(component, fixture);
      clickBtnById(fixture, 'cancel-button', true);

      expect(modal.isVisible()).toBeFalse();
    });
  });

  xit('should reset game state on new game from choose category New Game');
});


xdescribe('Processing chosen categories and flow', () => {

  xdescribe('Handling categories and component flow', () => {
    // todo: connect MatchWordsGameComponent's onNewGameWithCategories with fake chooser
    xit('should handle empty categories as normal new game');
    xit('should pass category array to service');
    xit('should generate the items from each category and concat them');
    xit('should shuffle the concatenated items into game cards');
  });

  xdescribe('Fallbacks and validation', () => {
    xit('should process single category');
    xit('should throw error when no categories chosen');
    xit('should fall back to default category');
    xit('should handle not enough items in category');
    xit('should handle when chosen categories don’t meet game requirements');
  });

  xdescribe('Connecting to service', () => {
    xit('should get all categories');
  });

  xdescribe('Caching and reuse', () => {
    xit('should keep fetched categories in cache for session');
    xit('should avoid re-fetching cached categories');
  });

});


async function triggerNewGameWithSelectedCategories(
  component: MatchWordsGameComponent,
  fixture: ComponentFixture<MatchWordsGameComponent>,
  ancestorTestId: string) {
  // set available categories
  const modalInstance = setupOpenChosenCategoryModal(component, fixture);

  modalInstance.availableCategories = ['Animals', 'Colors'];
  fixture.detectChanges();

  await toggleAllChips(fixture, ancestorTestId);

  const spy = spyOn(component, 'onNewGameWithCategories').and.callThrough();
  clickBtnById(fixture, 'new-categories-game-button');

  return {modalInstance, spy};
}

async function toggleAllChips(fixture: ComponentFixture<any>, ancestorTestId: string) {
  const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  const chips = await loader.getAllHarnesses(
    MatChipOptionHarness.with({ancestor: `[data-testid="${ancestorTestId}"]`})
  );
  for (const chip of chips) {
    await chip.toggle();
  }
}

function clickBtnById(
  fixture: ComponentFixture<MatchWordsGameComponent>,
  btnTestId: string,
  expectEnabled: boolean = false) {
  const btn = getElementByDataTestId(fixture, btnTestId) as HTMLButtonElement;
  if (expectEnabled) {
    expect(btn.disabled).toBeFalse();
  }

  btn.click();
}

function setupOpenChosenCategoryModal(component: MatchWordsGameComponent, fixture: ComponentFixture<MatchWordsGameComponent>): CategoryChooserModalComponent {
  component.onChooseCategory();
  fixture.detectChanges();

  return fixture.debugElement
    .query(By.directive(CategoryChooserModalComponent))
    .componentInstance as CategoryChooserModalComponent;
}
