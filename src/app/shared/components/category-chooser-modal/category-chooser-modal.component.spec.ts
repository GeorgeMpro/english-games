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
      expect(component.categories()).toEqual([]);
      spyOn(component, 'getCategories').and.callThrough();

      const result = component.getCategories();
      const msg = component.errorMessage;

      expect(result.length).toBe(1);
      expect(msg).toBe(ERROR_CATEGORIES_MESSAGE);
      expect(result).toEqual([DEFAULT_CATEGORY]);


    });
    it('should be able to add categories', () => {
      component.updateCategories(fakeCategories);

      expect(component.getCategories()).toEqual(fakeCategories);
    });

    it('should handle update duplicate categories', () => {
      const duplicateCategories = ['Animals', 'Utensils', 'Animals'];
      const reDuplicateCategories = ['Animals', 'Colors', 'Colors', 'Verbs', 'Verbs'];

      const firstExpected = ['Animals', 'Utensils'];
      const secondExpected = ['Animals', 'Colors', 'Verbs'];

      expectAdded(component, fakeCategories, fakeCategories);
      expectAdded(component, duplicateCategories, firstExpected);
      expectAdded(component, reDuplicateCategories, secondExpected);
    });

    it('should handle empty categories update', () => {
      expectAdded(component, fakeCategories, fakeCategories);

      expectAdded(component, [], fakeCategories);
    });

    it('should be able to reset categories', () => {
      expectAdded(component, fakeCategories, fakeCategories);

      component.resetCategories();

      expect(component.categories()).toEqual([]);
    });
  });

  describe('')

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


  xdescribe('Passing categories', () => {
    xit('should ');
    xit('should ');
    xit('should ');
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
    xit('should keep old fetched categories for this session, not calling again categories already fetched');
    xit('should get categories from service');
    xit('');
    xit('');
  });
});

function expectAdded(component: CategoryChooserModalComponent, catUpdate: string[], expected: string[]): void {
  component.updateCategories(catUpdate);
  expect(component.getCategories()).toEqual(expected);
}
