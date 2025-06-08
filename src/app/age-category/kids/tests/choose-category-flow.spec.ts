import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EndGameModalComponent} from '../../../shared/components/end-game-modal/end-game-modal.component';
import {getElementByDataTestId} from '../../../shared/tests/dom-test-utils';

describe('Choose category flow', () => {

  describe('Displaying modal', () => {
    let fixture: ComponentFixture<EndGameModalComponent>;
    let endGameModal: EndGameModalComponent;
    let chooseBtn: HTMLButtonElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [EndGameModalComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(EndGameModalComponent);
      endGameModal = fixture.componentInstance;
      fixture.detectChanges();

      chooseBtn = getElementByDataTestId(fixture, 'choose-button');
    });

    it('should have a choose button', () => {
      expect(chooseBtn).toBeTruthy();
      expect(chooseBtn.textContent?.toLowerCase()).toContain('change categories');
    });

    it('should open category chooser modal when clicking on "choose category"', () => {
      // should be hidden by default
      expect(getElementByDataTestId(fixture, 'category-chooser-modal')).toBeNull();

      chooseBtn.click();
      fixture.detectChanges();

      const chooseModal = getElementByDataTestId(fixture, 'category-chooser-modal');
      expect(chooseModal).toBeTruthy();


      //   todo
      //    button
      //    put button in  the match word game?
      //    add open close functionality

    });

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
