import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CategoryChooserModalComponent} from './category-chooser-modal.component';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryChooserModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryChooserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Displaying categories', () => {
    it('should have a non-empty categories list', () => {
      expect(component.categories?.length).toBeGreaterThan(0);
    });
    xit('should get categories from service');
    xit('should it should display entire categories input');
  });

  xdescribe('Choosing categories', () => {

    xit('should choose at least one category');
    xit('should be able to choose multiple categories');
    xit('should not proceed if no categories are chosen');

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

  });
});
