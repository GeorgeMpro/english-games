import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OutputEmitterRef} from '@angular/core';

import {EndGameModalComponent} from '../components/end-game-modal/end-game-modal.component';
import {MatchWordsStore} from '../../age-category/kids/match-words-game/match-words.store';
import {getElementByDataTestId} from './dom-test-utils';


describe('EndGameModalComponent', () => {
  let component: EndGameModalComponent;
  let fixture: ComponentFixture<EndGameModalComponent>;
  let store: MatchWordsStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndGameModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EndGameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering and Structure', () => {

    it('should render the modal container with data-testid', () => {
      const el: HTMLElement = fixture.nativeElement;
      const modal = el.querySelector('[data-testid="end-game-modal"]');
      expect(modal).not.toBeNull();
    });

    it('should have a Replay button with data-testid', () => {
      const btn = getElementByDataTestId(fixture, 'replay-button');
      expect(btn).not.toBeNull();
      expect(btn.textContent!.trim()).toBe('Replay');
    });

    it('should have a New Game button with data-testid', () => {
      const btn = getElementByDataTestId(fixture, 'new-game-button');
      expect(btn).not.toBeNull();
      expect(btn.textContent!.trim()).toBe('New Game');
    });

    it('should have feedback with data-testid', () => {
      const starRating = getElementByDataTestId(fixture, 'star-rating');
      const feedback = getElementByDataTestId(fixture, 'feedback-message');
      const correctCount = getElementByDataTestId(fixture, 'correct-count');
      const totalCount = getElementByDataTestId(fixture, 'total-count');

      expect(starRating).not.toBeNull();
      expect(feedback).not.toBeNull();
      expect(correctCount).not.toBeNull();
      expect(totalCount).not.toBeNull();
    });
  });

  describe('Button Clicks and events', () => {
    it('should emit replay when button is clicked', () => {
      expectButtonEmitEvent(fixture, component, 'replay-button', component.replayClicked);
    });

    it('should emit new game when button is clicked', () => {
      expectButtonEmitEvent(fixture, component, 'new-game-button', component.newGameClicked);
    });
  });

  // todo when handling feedback
  xdescribe('Feedback', () => {
    it('should display the correct feedback', () => {

    });
    xit('should give different encouraging messages', () => {

    });
  })
});


function expectButtonEmitEvent(
  fixture: ComponentFixture<EndGameModalComponent>,
  component: EndGameModalComponent,
  btnName: string,
  emitter: OutputEmitterRef<void>
): void {
  const btn = getElementByDataTestId(fixture, btnName);
  spyOn(emitter, 'emit');
  btn.click();
  expect(emitter.emit).toHaveBeenCalled();
}
