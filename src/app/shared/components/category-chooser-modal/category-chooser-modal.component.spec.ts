import {By} from '@angular/platform-browser';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CategoryChooserModalComponent} from './category-chooser-modal.component';

import {DEFAULT_CATEGORY, ERROR_CATEGORIES_MESSAGE} from '../../game-config.constants';
import {DebugElement} from '@angular/core';


describe('CategoryChooserModalComponent', () => {
  let component: CategoryChooserModalComponent;
  let fixture: ComponentFixture<CategoryChooserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryChooserModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryChooserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


function expectSelectedStates(fixture: ComponentFixture<CategoryChooserModalComponent>, expectedValues: boolean[]) {
  expect(getChips(fixture).map(
    chip => chip.componentInstance.selected
  )).toEqual(expectedValues);
}

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

      component.resetCategories();

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
      beforeEach(() => {
        component.availableCategories = fakeCategories;
        fixture.detectChanges();
      });

      it('should render available categories', () => {
        const chips = getChips(fixture);
        const labels: string[] = chips.map(chip =>
          chip.nativeElement.textContent.trim()
        );
        expect(chips.length).toBe(fakeCategories.length);
        expect(labels).toEqual(fakeCategories);
      });

      it('should have available categories start as not selected', () => {
        setupAndDetectChosenCategories(fixture, component, []);

        expectSelectedStates(fixture, [false, false]);
      });

      it('should mark available chips selected when they appear in the user chosen chips', () => {
        setupAndDetectChosenCategories(fixture, component, fakeCategories);
        expectSelectedStates(fixture, [true, true]);

        setupAndDetectChosenCategories(fixture, component, [fakeCategories[0]]);

        expectSelectedStates(fixture, [true, false]);
      });

      it('should be able to click select category', () => {
        getChips(fixture)[0].nativeElement.click();
        fixture.detectChanges();

        expect(component.chosenCategories()).toEqual([fakeCategories[0]]);
        expectSelectedStates(fixture, [true, false]);
      });

      xit('should be able to click select multiple categories')
      xit('should toggle selection on click', () => {

      });
    });

    describe('Ok and Back buttons', () => {

      xit('should disable the "ok" button when no categories selected', () => {

      });

      xit('should disable ok button if no categories are chosen');
    });

  });

  xdescribe('Ok and Cancel', () => {
    xit('should not update categories when clicking cancel button');
    xit('should close modal on cancel button');
    xit('should accept chosen categories when clicking ok button', () => {

    });
  });


  xdescribe('Displaying modal', () => {
    xit('should display modal on choose category button click');
    xit('should hide modal on finalising selection');
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

function getChips(fixture: ComponentFixture<CategoryChooserModalComponent>): DebugElement[] {
  return fixture.debugElement.queryAll(By.css('mat-chip-option[data-testid^="category-"]'));
}

function getSelectedCategories(chips: DebugElement[]): boolean[] {
  return chips.map(chip => chip.componentInstance.selected);
}

function setupAndDetectChosenCategories(fixture: ComponentFixture<CategoryChooserModalComponent>, component: CategoryChooserModalComponent, cats: string[]) {
  component.updateChosenCategories(cats);
  fixture.detectChanges();
}
