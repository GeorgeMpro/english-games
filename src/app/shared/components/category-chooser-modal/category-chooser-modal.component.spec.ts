import {By} from '@angular/platform-browser';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CategoryChooserModalComponent} from './category-chooser-modal.component';

import {DEFAULT_CATEGORY, ERROR_CATEGORIES_MESSAGE} from '../../game-config.constants';


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

      component.selectCategories(fakeCategories[0]);

      expect(component.chosenCategories()).toEqual([fakeCategories[0]]);

      component.selectCategories(fakeCategories);
      expect(component.chosenCategories()).toEqual(fakeCategories);
    });

    it('should handle empty selected categories', () => {
      component.updateChosenCategories(fakeCategories);

      component.selectCategories([]);

      expect(component.chosenCategories()).toEqual(fakeCategories);
    });


  });

  describe('Rendering and interaction', () => {
    it('should render available categories', () => {
      component.availableCategories = fakeCategories;
      fixture.detectChanges();

      const chips = fixture.debugElement.queryAll(By.css('mat-chip-option[data-testid^="category-"]'));
      const labels = chips.map(chip =>
        chip.nativeElement.textContent.trim()
      );

      expect(chips.length).toBe(fakeCategories.length);
      expect(labels).toEqual(fakeCategories);

    });
    xit('should have previously selected categories from available categories', () => {

    });

    xit('should disable the "ok" button when no categories selected', () => {

    });

  });
  xdescribe('Choosing categories', () => {

    xit('should choose at least one category');
    xit('should be able to choose multiple categories');
    xit('should not proceed if no categories are chosen');
    xit('should display all available categories');

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
