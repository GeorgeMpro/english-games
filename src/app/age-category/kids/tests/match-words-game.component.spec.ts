import {ComponentFixture, DeferBlockState} from '@angular/core/testing';

import {MatchWordsGameComponent} from '../match-words-game/match-words-game.component';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {MatchWordsService} from '../match-words-game/match-words.service';

import {matchItems} from '../../../../assets/test-data/match-items';
import {
  expectClickCallsMethod,
  getElementByDataTestId,
  getQuerySelectorAll,
  simulateButtonClick
} from '../../../shared/tests/dom-test-utils';
import {setupMatchComponent} from './test-setup-util';
import {animalsGroup} from '../../../shared/game-config.constants';


describe('MatchWordsGameComponent', () => {

  let fixture: ComponentFixture<MatchWordsGameComponent>;
  let component: MatchWordsGameComponent;
  let store: MatchWordsStore;

  beforeEach(async () => {

    ({fixture, component, store} = await setupMatchComponent({withDefer: true, withMockServices: true}));


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


describe('Effect: currentStage triggers generateGameCardsFromItems', () => {
  let fixture: ComponentFixture<MatchWordsGameComponent>;
  let component: MatchWordsGameComponent;
  let store: MatchWordsStore;
  let service: MatchWordsService;

  beforeEach(async () => {

    ({fixture, component, store, service} = await setupMatchComponent({withMockServices: true}));


    // force ready state
    component.gameReady.set(true);
    fixture.detectChanges();
  });

  it('should call generateGameCardsFromItems when currentStage changes', () => {
    const spy = spyOn(service, 'generateGameCardsFromItems');

    const items = [
      {id: 1, word: 'Dog', imageUrl: 'dog.png', wikiUrl: '', matched: false}
    ];

    // Stage 0 is empty, stage 1 contains our test items
    store.stageItems.set([[], items]);
    store.currentStage.set(1);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledOnceWith(items);
  });


  it('should not crash when stage index is out of bounds', () => {
    const spy = spyOn(service, 'generateGameCardsFromItems');

    store.stageItems.set([]); // empty array
    store.currentStage.set(99); // out of bounds

    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith([]); // still called with empty array
  });

  it('should not call generateGameCardsFromItems if stage has not changed', () => {
    const spy = spyOn(service, 'generateGameCardsFromItems');

    const items = [{id: 1, word: 'Dog', imageUrl: 'dog.png', wikiUrl: '', matched: false}];
    store.stageItems.set([[], items]);

    store.currentStage.set(1);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledOnceWith(items);

    // set again with same value
    spy.calls.reset();
    store.currentStage.set(1);
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });
});


describe('CSS Match class logic', () => {
  let fixture: ComponentFixture<MatchWordsGameComponent>;
  let component: MatchWordsGameComponent;
  let service: MatchWordsService;
  let store: MatchWordsStore;


  beforeEach(async () => {
    ({fixture, component, store, service} = await setupMatchComponent({withMockServices: true}));

    store.items.set(matchItems);
    service.initializeGamePlay();
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
