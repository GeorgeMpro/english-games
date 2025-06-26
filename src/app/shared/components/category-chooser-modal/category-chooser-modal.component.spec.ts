import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {HarnessLoader} from '@angular/cdk/testing';

import {MatChipOptionHarness} from '@angular/material/chips/testing';

import {CategoryChooserModalComponent} from './category-chooser-modal.component';
import {getElementByDataTestId} from '../../tests/dom-test-utils';
import {WordGroup} from '../../../data-access/api.models';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {
  animalsGroup, colorsGroup,
  DEFAULT_CATEGORIES, DEFAULT_PAGINATION_NUMBER_OF_ITEMS,
  sportsGroup
} from '../../game-config.constants';
import validCategoriesMock from '../../../age-category/kids/tests/mocks/valid-word-groups.json'
import {MatPaginatorHarness} from '@angular/material/paginator/testing';


describe('Functionality', () => {
  let component: CategoryChooserModalComponent;
  let fixture: ComponentFixture<CategoryChooserModalComponent>;
  const fakeCategories: WordGroup[] = DEFAULT_CATEGORIES;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryChooserModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryChooserModalComponent);
    component = fixture.componentInstance;
    component.availableCategories = fakeCategories; // <-- Ensure this is set
    component.isVisible.set(true);
    fixture.detectChanges();
  });

  describe('Handling categories', () => {

    it('should be able to update categories', () => {
      expectUpdated(component, fakeCategories, fakeCategories);
    });

    it('should handle update duplicate categories', () => {
      const duplicateCategories = [animalsGroup, sportsGroup, animalsGroup];
      const reDuplicateCategories = [
        animalsGroup, colorsGroup, colorsGroup, sportsGroup, sportsGroup];

      const firstExpected = [animalsGroup, sportsGroup];
      const secondExpected = [animalsGroup, colorsGroup, sportsGroup];

      expectUpdated(component, fakeCategories, fakeCategories);
      expectUpdated(component, duplicateCategories, firstExpected);
      expectUpdated(component, reDuplicateCategories, secondExpected);
    });

    it('should handle empty categories update', () => {
      expectUpdated(component, fakeCategories, fakeCategories);

      expectUpdated(component, [], fakeCategories);
    });

    it('should be able to reset categories', () => {
      expectUpdated(component, fakeCategories, fakeCategories);

      component.resetChosenCategories();

      expect(component.chosenCategories()).toEqual([]);
    });
  });

  describe('Category user selection', () => {
    it('should select categories from available categories', () => {
      //   todo- dummy categories, select from them somehow, check updated, selected start with []
      component.availableCategories = fakeCategories;
      expect(component.chosenCategories()).toEqual([]);

      component.submittedCategories(fakeCategories[0]);

      expect(component.chosenCategories()).toEqual([fakeCategories[0]]);

      component.submittedCategories(fakeCategories);
      expect(component.chosenCategories()).toEqual(fakeCategories);
    });

    it('should handle empty selected categories', () => {
      component.updateChosenCategories(fakeCategories);

      component.submittedCategories([]);

      expect(component.chosenCategories()).toEqual(fakeCategories);
    });


  });

  describe('Rendering and interaction', () => {
    describe('Display and selection', () => {

      let loader: HarnessLoader;

      beforeEach(() => {
        component.availableCategories = fakeCategories;
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
      });

      it('should render available categories', async () => {
        const chips = await loader.getAllHarnesses(MatChipOptionHarness);
        const labels = await Promise.all(chips.map(chip => chip.getText()));
        expect(chips.length).toBe(fakeCategories.length);
        expect(labels).toEqual(fakeCategories.map(c => c.title));
      });

      it('should have available categories start as not selected', async () => {
        setupAndDetectChosenCategories(fixture, component, []);

        await expectSelectedStates(fixture, [false, false]);
      });

      it('should mark available chips selected when they appear in the user chosen chips', async () => {
        setupAndDetectChosenCategories(fixture, component, fakeCategories);
        await expectSelectedStates(fixture, [true, true]);

        setupAndDetectChosenCategories(fixture, component, [fakeCategories[0]]);

        await expectSelectedStates(fixture, [true, false]);
      });

      it('should toggle chip selection', async () => {

        // todo cleanup?
        const chips = await loader.getAllHarnesses(MatChipOptionHarness);

        await chips[0].toggle();
        await chips[1].toggle();
        expect(await chips[0].isSelected()).toBeTrue();
        expect(await chips[1].isSelected()).toBeTrue();

        await chips[0].toggle();
        expect(await chips[0].isSelected()).toBeFalse();
        expect(await chips[1].isSelected()).toBeTrue();


        // Internal state should NOT be updated yet
        expect(component.chosenCategories()).toEqual([]);
      });


    });


    describe('New Categories Game and Cancel', () => {
      const newCtgGameBtnId = "new-categories-game-button";
      const cancelId = "cancel-button";

      let loader: HarnessLoader;
      let newCtgGameBtn: HTMLButtonElement;
      let cancelBtn: HTMLButtonElement;

      beforeEach(() => {
        component.availableCategories = fakeCategories;
        loader = TestbedHarnessEnvironment.loader(fixture);
        newCtgGameBtn = getElementByDataTestId(fixture, newCtgGameBtnId);
        cancelBtn = getElementByDataTestId(fixture, cancelId);
        fixture.detectChanges();
      });

      it('should render a New Game button', () => {
        expect(newCtgGameBtn).toBeTruthy();
      });

      it('should update selected categories on New Game click', async () => {
        await enableOkBtnInteraction(component, loader, fakeCategories, newCtgGameBtn);

        expect(component.chosenCategories()).toEqual(fakeCategories);
      });

      it('should close modal on New Game (when not disabled)', async () => {
        await enableOkBtnInteraction(component, loader, fakeCategories, newCtgGameBtn);

        expect(component.isVisible()).toBeFalse();
      });

      it('should disable New Game button if no categories are chosen', () => {
        component.resetChosenCategories();
        fixture.detectChanges();

        expect(newCtgGameBtn.disabled).toBeTrue();
      });

      it('should render a cancel button', () => {
        expect(cancelBtn).toBeTruthy();
      });

      it('should close modal on cancel button', () => {
        expect(component.isVisible()).toBeTrue();

        cancelBtn.click();

        expect(component.isVisible()).toBeFalse();
      });
    });
  });

  describe('Handling component visibility', () => {

    it('should set to visible on "open"', () => {
      component.isVisible.set(false);
      expect(component.isVisible()).toBeFalse();

      component.open();

      expect(component.isVisible()).toBe(true);
    });

    it('should set to visibility to false and reset chosen categories on "close"', () => {
      component.isVisible.set(true);
      component.chosenCategories.set(fakeCategories);
      expect(component.chosenCategories()).toEqual(fakeCategories);
      component.close();

      expect(component.isVisible()).toBe(false);
      expect(component.chosenCategories()).toEqual([]);
    });

  });
});

describe('Pagination and chips', () => {
  const allCategoriesMock: WordGroup[] = validCategoriesMock.data.items;

  let component: CategoryChooserModalComponent;
  let fixture: ComponentFixture<CategoryChooserModalComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryChooserModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryChooserModalComponent);
    component = fixture.componentInstance;
    component.availableCategories = allCategoriesMock;
    component.isVisible.set(true);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should keep temp copy of selected chips between pages', async () => {
    const chips: MatChipOptionHarness[] = await loader.getAllHarnesses(MatChipOptionHarness);
    const labels = await Promise.all(chips.map(chip => chip.getText()));

    const paginator: MatPaginatorHarness = await loader.getHarness(MatPaginatorHarness.with({selector: '[data-testid="chips-paginator"]'}));


    expect(chips.length)
      .withContext('should display default number of items per page')
      .toBe(DEFAULT_PAGINATION_NUMBER_OF_ITEMS);

    await chips[0].select();
    await chips[1].select();

    // change page
    await paginator.goToNextPage();

    await paginator.goToPreviousPage();

    //   todo
    //    select chip/s
    //    move page
    //     >>
    //     > <
    //    expect stay selected ( temp?)

  });

  xit('should clear temp chips on new game', () => {

  });

  xit('should clear all selections when reset is called');

  xit('should persist selections when navigating back and forth');
  xit('should enable/disable OK button based on selections across pages');

  xit('should handle edge case of no selections with pagination navigation');

  xit('should emit selected categories correctly on New Game click');

});


function expectUpdated(component: CategoryChooserModalComponent, catUpdate: WordGroup[], expected: WordGroup[]): void {
  component.updateChosenCategories(catUpdate);
  expect(component.getChosenCategories()).toEqual(expected);
}

function setupAndDetectChosenCategories(fixture: ComponentFixture<CategoryChooserModalComponent>, component: CategoryChooserModalComponent, cats: WordGroup[]) {
  component.updateChosenCategories(cats);
  fixture.detectChanges();
}

async function expectSelectedStates(fixture: ComponentFixture<CategoryChooserModalComponent>, expected: boolean[]) {
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const chips = await loader.getAllHarnesses(MatChipOptionHarness);
  const selectedStates = await Promise.all(chips.map(c => c.isSelected()));
  expect(selectedStates).toEqual(expected);
}

async function enableOkBtnInteraction(
  component: CategoryChooserModalComponent,
  loader: HarnessLoader,
  dummyCategories: WordGroup[],
  newCtgGameBtn: HTMLButtonElement) {
  component.availableCategories = dummyCategories;
  const chips = await loader.getAllHarnesses(MatChipOptionHarness);
  await chips[0].toggle();
  await chips[1].toggle();

  expect(newCtgGameBtn.disabled).toBeFalse();
  newCtgGameBtn.click();
}
