import {ComponentFixture, TestBed, fakeAsync} from '@angular/core/testing';

import {signal} from '@angular/core';

import {MatchWordsGameComponent} from '../match-words-game/match-words-game.component';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {MatchItem} from '../../../shared/models/kids.models';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('MatchWordsGameComponent Placeholders', () => {
  let fixture: ComponentFixture<MatchWordsGameComponent>;
  let component: MatchWordsGameComponent;
  let store: MatchWordsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatchWordsGameComponent],
      providers: [MatchWordsStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    fixture = TestBed.createComponent(MatchWordsGameComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MatchWordsStore);
  });


  // todo fix later
  // todo Notice: no defer test atm
  // it('should show placeholders before images load, and hide them after', fakeAsync(() => {
  //   store.wordCards.set([
  //     {id: 1, text: 'cat', matched: false},
  //     {id: 2, text: 'dog', matched: false}
  //   ]);
  //   store.imageCards.set([
  //     {id: 1, url: 'img/cat.png', text: 'cat', matched: false},
  //     {id: 2, url: 'img/dog.png', text: 'dog', matched: false}
  //   ]);
  //
  //   component.allImagesLoaded.set(false);
  //   component.gameReady.set(true);
  //   fixture.detectChanges();
  //
  //   let placeholders = fixture.nativeElement.querySelectorAll('[data-testid="card-placeholder"]');
  //   expect(placeholders.length).toBe(4);
  //
  //   component.allImagesLoaded.set(true);
  //   fixture.detectChanges();
  //
  //   placeholders = fixture.nativeElement.querySelectorAll('[data-testid="card-placeholder"]');
  //   expect(placeholders.length).toBe(0);
  // }));

  describe('Resetting image state', () => {

    let resetSpy: jasmine.Spy;
    beforeEach((() => {
      resetSpy = spyOn(component, 'resetImageLoading');
    }))

    it('should call resetImageLoading on new game', () => {
      component.onNewGame();
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should call resetImageLoading on replay', () => {
      component.onReplayGame();
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should call resetImageLoading on new categories game', () => {
      component.onNewGameWithCategories([]);
      expect(resetSpy).toHaveBeenCalled();
    });

  })
});

