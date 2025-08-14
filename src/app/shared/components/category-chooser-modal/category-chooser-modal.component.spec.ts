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
  DEFAULT_CATEGORIES,
  sportsGroup
} from '../../game-config.constants';
import validCategoriesMock from '../../../../assets/data/all-words-in-categories/all-word-groups.json'
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
      component.availableCategories = [
        animalsGroup, sportsGroup, colorsGroup
      ]
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
      // Set selection to all
      component.selectedIds.set(new Set(fakeCategories.map(c => c.id)));
      expect(component.getChosenCategories()).toEqual(fakeCategories);

      // Set selection to empty
      component.selectedIds.set(new Set());
      expect(component.getChosenCategories()).toEqual([]);
    });


    it('should be able to reset categories', () => {
      expectUpdated(component, fakeCategories, fakeCategories);

      component.resetChosenCategories();

      expect(component.getChosenCategories()).toEqual([]);
    });
  });

  describe('Category user selection', () => {

    it('should select categories from available categories', () => {
      component.availableCategories = fakeCategories;
      expect(component.getChosenCategories()).toEqual([]);

      // Select first category
      component.selectedIds.set(new Set([fakeCategories[0].id]));
      expect(component.getChosenCategories()).toEqual([fakeCategories[0]]);

      // Select all categories
      component.selectedIds.set(new Set(fakeCategories.map(c => c.id)));
      expect(component.getChosenCategories()).toEqual(fakeCategories);
    });

    it('should handle empty selected categories', () => {
      // Select all categories
      component.selectedIds.set(new Set(fakeCategories.map(c => c.id)));
      expect(component.getChosenCategories()).toEqual(fakeCategories);

      // Deselect all
      component.selectedIds.set(new Set());
      expect(component.getChosenCategories()).toEqual([]);
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
        let emitted: WordGroup[] | undefined;
        component.submit.subscribe(val => emitted = val);

        await enableOkBtnInteraction(component, loader, fakeCategories, newCtgGameBtn);

        expect(emitted).toEqual(fakeCategories); // or .map(x => x.id) if you want to ignore order
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


    it('should set visibility to false and reset selected categories on "close"', () => {
      component.isVisible.set(true);

      // Select all categories
      component.selectedIds.set(new Set(fakeCategories.map(c => c.id)));
      expect(component.getChosenCategories()).toEqual(fakeCategories);

      component.close();

      expect(component.isVisible()).toBe(false);
      expect(component.getChosenCategories()).toEqual([]);
    });
  });
});

describe('Keyboard interactions (ESC)', () => {
  let fixture: ComponentFixture<CategoryChooserModalComponent>;
  let component: CategoryChooserModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryChooserModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryChooserModalComponent);
    component = fixture.componentInstance;
    component.availableCategories = DEFAULT_CATEGORIES;
    fixture.detectChanges();
  });

  it('closes when ESC is pressed and modal is visible', () => {
    component.open();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
    fixture.detectChanges();

    expect(component.isVisible()).toBeFalse();
    expect(getElementByDataTestId(fixture, 'category-chooser-modal')).toBeNull();
  });

  it('does nothing when ESC is pressed and modal is hidden', () => {
    component.close();
    fixture.detectChanges();

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
    fixture.detectChanges();

    expect(component.isVisible()).toBeFalse();
  });

  it('ignores non-ESC keys', () => {
    component.open();
    fixture.detectChanges();

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    fixture.detectChanges();

    expect(component.isVisible()).toBeTrue();
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


  it('should keep selected chips when navigating between pages', async () => {
    const chipsPage1 = await loader.getAllHarnesses(MatChipOptionHarness);
    const paginator = await loader.getHarness(MatPaginatorHarness.with({selector: '[data-testid="chips-paginator"]'}));

    // Select first chip on page 1
    await chipsPage1[0].select();
    expect(await chipsPage1[0].isSelected()).toBeTrue();

    // Go to next page
    await paginator.goToNextPage();
    fixture.detectChanges();

    const chipsPage2 = await loader.getAllHarnesses(MatChipOptionHarness);
    // Select first chip on page 2
    await chipsPage2[0].select();
    expect(await chipsPage2[0].isSelected()).toBeTrue();

    // Go back to previous page
    await paginator.goToPreviousPage();
    fixture.detectChanges();

    const chipsPage1Return = await loader.getAllHarnesses(MatChipOptionHarness);
    // Previously selected chip on page 1 should remain selected
    expect(await chipsPage1Return[0].isSelected()).toBeTrue();

    // Go forward again
    await paginator.goToNextPage();
    fixture.detectChanges();

    const chipsPage2Return = await loader.getAllHarnesses(MatChipOptionHarness);
    // Previously selected chip on page 2 should remain selected
    expect(await chipsPage2Return[0].isSelected()).toBeTrue();
  });


  xit('should clear temp chips on new game', () => {

  });

  xit('should clear all selections when reset is called');

  xit('should persist selections when navigating back and forth');
  xit('should enable/disable OK button based on selections across pages');

  xit('should handle edge case of no selections with pagination navigation');

  xit('should emit selected categories correctly on New Game click');

});


function expectUpdated(
  component: CategoryChooserModalComponent,
  catUpdate: WordGroup[],
  expected: WordGroup[]
): void {
  component.selectedIds.set(new Set(catUpdate.map(c => c.id)));

  const actuallySortedIds = component.getChosenCategories().map(c => c.id).sort();
  const expectedSortedIds = expected.map(c => c.id).sort();
  expect(actuallySortedIds).toEqual(expectedSortedIds);
}


function setupAndDetectChosenCategories(
  fixture: ComponentFixture<CategoryChooserModalComponent>,
  component: CategoryChooserModalComponent,
  cats: WordGroup[]
) {
  component.selectedIds.set(new Set(cats.map(c => c.id)));
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
