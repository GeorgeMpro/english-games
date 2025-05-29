import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';

import {IframeModeDirective} from './iframe-mode.directive';
import {AppComponent} from '../../../app.component';
import {KidsComponent} from '../../../age-category/kids/kids.component';
import {getElementByDataTestId} from '../../tests/dom-test-utils';


describe('IframeModeDirective', () => {
  it('should detect iframe mode when embedded in an iframe', () => {
    spyOn<any>(IframeModeDirective, 'getContext').and.returnValue(
      {self: {}, top: {}}
    );
    expect(IframeModeDirective.isEmbedded()).toBeTrue();
  });

  it('should detect normal mode when NOT embedded in iframe', () => {
    const shared = {};
    spyOn<any>(IframeModeDirective, 'getContext').and.returnValue({
      self: shared, top: shared,
    });

    expect(IframeModeDirective.isEmbedded()).toBeFalse();
  });

  describe('embedded component behavior', () => {
    describe('header and footer', () => {
      const elements = [
        'app-header', 'app-footer'
      ];
      beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [AppComponent],
          providers: [
            provideRouter([])
          ]
        }).compileComponents();
      });
      it('it should not display header and footer in iframe', () => {
        spyAndReturnEmbeddedState(true);

        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        expectElementsToBeNull(fixture, elements);
      });

      it('it should display header and footer in iframe', () => {
        spyAndReturnEmbeddedState(false);

        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        expectElementsToBeNotNull(fixture, elements);
      });
    });

    describe('kids games', () => {
      beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [KidsComponent],
          providers: [
            provideRouter([])
          ]
        }).compileComponents();
      });

      it('should not display kids game navigation when embedded', () => {
        spyAndReturnEmbeddedState(true);
        const fixture = TestBed.createComponent(KidsComponent);
        fixture.detectChanges();

        expectElementsToBeNull(fixture, ['kids-games'])
      });

      it('should display kids game navigation when embedded', () => {

        spyAndReturnEmbeddedState(false);
        const fixture = TestBed.createComponent(KidsComponent);
        fixture.detectChanges();

        expectElementsToBeNotNull(fixture, ['kids-games']);
      });
    });
  });
});

function spyAndReturnEmbeddedState(setEmbeddedValue: boolean) {
  spyOn<any>(IframeModeDirective, 'isEmbedded').and.returnValue(setEmbeddedValue);
}

function expectElementsToBeNull(fixture: any, elements: string[]): void {
  for (const testId of elements) {
    expect(getElementByDataTestId(fixture, testId)).toBeNull();
  }
}

function expectElementsToBeNotNull(fixture: any, elements: string[]): void {
  for (const testId of elements) {
    expect(getElementByDataTestId(fixture, testId)).not.toBeNull();
  }
}

//todo del
//  the embedded true might help
// <iframe src="http://localhost:4200/kids/match-words" width="100%" height="100%"></iframe>
