import {provideHttpClient} from '@angular/common/http';
import {ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed} from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {lastValueFrom, of} from 'rxjs';

import {MatchWordsGameComponent} from '../match-words-game/match-words-game.component';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {MatchWordsService} from '../match-words-game/match-words.service';
import {matchItems} from '../../../../assets/test-data/match-items';
import {GameLogicService} from '../../../shared/services/game-logic.service';
import {Category, VocabularyService} from '../../../shared/services/vocabulary.service';
import {WikiService} from '../../../shared/services/wiki.service';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {
  expectClickCallsMethod,
  getElementByDataTestId,
  getQuerySelectorAll,
  simulateButtonClick
} from '../../../shared/tests/dom-test-utils';


function assertEndModalClosingByButtonPress(fixture: ComponentFixture<MatchWordsGameComponent>, buttonToPress: string) {
  const endGameModal = getElementByDataTestId(fixture, 'end-game-modal');

  // Ensure modal is initially present
  expect(endGameModal).not.toBeNull();

  // Simulate the button click
  simulateButtonClick(fixture, buttonToPress);

  // Update the fixture to reflect changes
  fixture.detectChanges();

  // Verify the modal is no longer present
  expect(getElementByDataTestId(fixture, 'end-game-modal')).toBeNull();
}

describe('MatchWordsGameComponent', () => {
  let fixture: ComponentFixture<MatchWordsGameComponent>;
  let component: MatchWordsGameComponent;
  let store: MatchWordsStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchWordsGameComponent],
      providers: [
        MatchWordsStore,
        MatchWordsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    }).compileComponents();

    fixture = TestBed.createComponent(MatchWordsGameComponent);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(MatchWordsStore);

    component.ngOnInit();
    component.gameReady.set(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('End Game Functionality', () => {
    let deferBlock: any;

    beforeEach(async () => {
      store.gameOver.set(true);
      fixture.detectChanges();

      // Notice: manually execute defer block
      [deferBlock] = await fixture.getDeferBlocks();
      await deferBlock.render(DeferBlockState.Complete);
      fixture.detectChanges();
    });

    it('should not show end game modal when game is not over', () => {
      store.gameOver.set(false);
      fixture.detectChanges();
      expect(getElementByDataTestId(fixture, 'end-game-modal')).toBeNull();
    });

    it('should display game end modal when game is over', async () => {
      const modal = getElementByDataTestId(fixture, 'end-game-modal');
      expect(modal).withContext('should render the end-game modal').not.toBeNull();
    });

    it('should call onNewGame when New Game button is clicked', () => {
      expectClickCallsMethod(
        fixture,
        'new-game-button',
        component,
        'onNewGame');
    });

    it('should call MatchWordsService.newGame when New Game button is clicked', () => {
      expectClickCallsMethod(
        fixture,
        'new-game-button',
        component['matchWordService'],
        'newGame')
    });

    it('should call onReplayGame when Replay button is clicked', () => {
      expectClickCallsMethod(
        fixture,
        'replay-button',
        component,
        'onReplayGame')
    });
    it('should call MatchWordsService.replayGame when Replay button is clicked', () => {
      expectClickCallsMethod(
        fixture,
        'replay-button',
        component['matchWordService'],
        'replayGame'
      )
    });

    it('should hide play cards after game is over', () => {
      const gameGrid = getElementByDataTestId(fixture, 'game-grid');

      expect(gameGrid).toBeNull();
    });

    it('should close the end game modal when Replay button is clicked and game state is reset', () => {
      assertEndModalClosingByButtonPress(fixture, 'replay-button');
    });

    it('should close the end game modal when New Game button is clicked and game state is reset', () => {
      assertEndModalClosingByButtonPress(fixture, 'new-game-button');
    });
  });
});


describe('CSS Match class logic', () => {
  let fixture: ComponentFixture<MatchWordsGameComponent>;
  let component: MatchWordsGameComponent;
  let service: MatchWordsService;
  let store: MatchWordsStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchWordsGameComponent, CommonModule, NgOptimizedImage],
      providers: [
        MatchWordsStore,
        MatchWordsService,
        GameLogicService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: VocabularyService,
          useValue: {getList: () => of(matchItems.map(i => i.word))}
        },
        {
          provide: WikiService,
          useValue: {getItems: () => of(structuredClone(matchItems))}
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchWordsGameComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MatchWordsStore);
    service = TestBed.inject(MatchWordsService);

    // Initialize game data before the component is initialized
    await lastValueFrom(service.initializeGameData(Category.Animals));
    service.initializeGamePlay();

    store.items.set(matchItems);
    component.gameReady.set(true);
    fixture.detectChanges();
  });

  it('should remove "matched" class from all cards after replaying the game', async () => {
    // manually patch test data and simulate matched state
    assertMatchedStateBeforeReplay(store, fixture);

    component.onReplayGame();
    fixture.detectChanges();

    // Verify both data and DOM state
    assertMatchedStateAfterReplay(store, fixture);
  });

});

function assertMatchedStateBeforeReplay(store: MatchWordsStore, fixture: ComponentFixture<MatchWordsGameComponent>) {
  const matchedItems = matchItems.slice(0, 6).map(item => ({
    ...item,
    matched: true
  }));

  store.shuffledItemsSlice.set(matchedItems);
  store.stageItems.set([matchedItems]);

  store.wordCards.set(matchedItems.map(item => ({
    id: item.id,
    text: item.word,
    matched: true
  })));

  store.imageCards.set(matchedItems.map(item => ({
    id: item.id,
    text: item.word,
    url: item.imageUrl,
    matched: true
  })));

  fixture.detectChanges();

  const preReplay = [
    ...fixture.nativeElement.querySelectorAll('[data-testid="word-card"]'),
    ...fixture.nativeElement.querySelectorAll('[data-testid="image-card"]'),
  ];

  for (const card of preReplay) {
    expect(card.classList.contains('matched')).toBeTrue();
  }
}

function assertMatchedStateAfterReplay(store: MatchWordsStore, fixture: ComponentFixture<MatchWordsGameComponent>) {
  expect(areCardsMatched(store.wordCards())).toBeFalse();
  expect(areCardsMatched(store.imageCards())).toBeFalse();

  const postReplay = [
    ...getQuerySelectorAll(fixture, "word-card"),
    ...getQuerySelectorAll(fixture, "image-card"),
  ];

  for (const card of postReplay) {
    expect(card.classList.contains('matched')).toBeFalse();
  }
}

function areCardsMatched(cards: { matched: boolean }[]): boolean {
  return cards.some(card => card.matched);
}
