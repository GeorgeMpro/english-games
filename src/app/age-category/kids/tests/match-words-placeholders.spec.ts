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

  it('should show placeholder cards while items/images are loading and reveal cards only after all are loaded', fakeAsync(() => {

    const mockMatchItems: MatchItem[] = [
      {id: 1, word: 'cat', imageUrl: 'img/cat.png', matched: false},
      {id: 2, word: 'dog', imageUrl: 'img/dog.png', matched: false}
    ];
    store.items.set(mockMatchItems);
    // Simulate initial state: images not loaded
    component.allImagesLoaded = signal(false);
    fixture.detectChanges();

    // Assert placeholders visible, real cards hidden
    let placeholders = fixture.nativeElement.querySelectorAll('[data-testid="card-placeholder"]');
    expect(placeholders.length).toBe(mockMatchItems.length);

    let realCards = fixture.nativeElement.querySelectorAll('[data-testid="game-card"]');
    expect(realCards.length).toBe(0);

    // Simulate all images loaded
    component.allImagesLoaded.set(true);
    fixture.detectChanges();

    // Assert placeholders gone, real cards visible with fade-in
    placeholders = fixture.nativeElement.querySelectorAll('[data-testid="card-placeholder"]');
    expect(placeholders.length).toBe(0);

    realCards = fixture.nativeElement.querySelectorAll('[data-testid="game-card"]');
    expect(realCards.length).toBe(mockMatchItems.length);
    realCards.forEach((card: HTMLElement) => {
      expect(card.classList.contains('fade-in')).toBeTrue();
    });
  }));
});
