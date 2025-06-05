import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {HarnessLoader} from '@angular/cdk/testing';

import {MatChipOptionHarness} from '@angular/material/chips/testing';

import {CategoryChooserModalComponent} from './category-chooser-modal.component';
import {DEFAULT_CATEGORY, ERROR_CATEGORIES_MESSAGE} from '../../game-config.constants';
import {getElementByDataTestId} from '../../tests/dom-test-utils';


describe('Functionality', () => {
  let component: CategoryChooserModalComponent;
  let fixture: ComponentFixture<CategoryChooserModalComponent>;
  const fakeCategories: string[] = ['Animals', 'Colors'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryChooserModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryChooserModalComponent);
    component = fixture.componentInstance;
    component.isVisible.set(true);
    fixture.detectChanges();
  });

  describe('Handling categories', () => {

    it('should handle empty categories', () => {
      expect(component.chosenCategories()).toEqual([]);
      spyOn(component, 'getChosenCategories').and.callThrough();

      const result = component.setupCategories();
      const msg = component.errorMessage;

      expect(result.length).toBe(1);
      expect(msg).toBe(ERROR_CATEGORIES_MESSAGE);
      expect(result).toEqual([DEFAULT_CATEGORY]);


    });
    it('should be able to update categories', () => {
      expectUpdated(component, fakeCategories, fakeCategories);
    });

    it('should handle update duplicate categories', () => {
      const duplicateCategories = ['Animals', 'Utensils', 'Animals'];
      const reDuplicateCategories = ['Animals', 'Colors', 'Colors', 'Verbs', 'Verbs'];

      const firstExpected = ['Animals', 'Utensils'];
      const secondExpected = ['Animals', 'Colors', 'Verbs'];

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
        expect(labels).toEqual(fakeCategories);
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

    describe('Ok and Cancel', () => {
      let loader: HarnessLoader;

      const okId = "ok-button";
      let okBtn: HTMLButtonElement;

      beforeEach(() => {
        component.availableCategories = fakeCategories;
        loader = TestbedHarnessEnvironment.loader(fixture);
        okBtn = getElementByDataTestId(fixture, okId);
        fixture.detectChanges();
      });

      it('should render an OK button', () => {
        expect(okBt
      });

      it('should update selected categories on OK click', async () => {
        component.availableCategories = fakeCategories;
        const chips = await loader.getAllHarnesses(MatChipOptionHarness);
        await chips[0].toggle();
        await chips[1].toggle();

        expect(okBtn.disabled).toBeFalse();
        okBtn.click();

        expect(component.chosenCategories()).toEqual(fakeCategories);
      });

      it('should disable ok button if no categories are chosen', () => {
        component.resetChosenCategories();
        fixture.detectChanges();

        expect(okBtn.disabled).toBeTrue();
      });

      xit('should close modal on cancel button');
      xit('should accept chosen categories when clicking ok button', () => {

      });
    });
  });


  // todo when in parent component - maybe move to further testing
  xdescribe('Displaying modal', () => {
    xit('should display modal on choose category button click');
    xit('should hide modal on finalising selection');
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
    xit('should ');


    // todo end to end
    // todo maybe cache in a map <string, item[]>

    xdescribe('Passing categories', () => {
      xit('should keep old fetched categories for this session, not calling again categories already fetched');
      xit('should get categories from service');
      xit('should ');
    });

  });
});

function expectUpdated(component: CategoryChooserModalComponent, catUpdate: string[], expected: string[]): void {
  component.updateChosenCategories(catUpdate);
  expect(component.getChosenCategories()).toEqual(expected);
}

function setupAndDetectChosenCategories(fixture: ComponentFixture<CategoryChooserModalComponent>, component: CategoryChooserModalComponent, cats: string[]) {
  component.updateChosenCategories(cats);
  fixture.detectChanges();
}

async function expectSelectedStates(fixture: ComponentFixture<CategoryChooserModalComponent>, expected: boolean[]) {
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const chips = await loader.getAllHarnesses(MatChipOptionHarness);
  const selectedStates = await Promise.all(chips.map(c => c.isSelected()));
  expect(selectedStates).toEqual(expected);
}
