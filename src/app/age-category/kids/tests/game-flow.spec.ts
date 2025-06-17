import {TestBed} from '@angular/core/testing';

import {MatchWordsService} from '../match-words-game/match-words.service';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {VocabularyService} from '../../../shared/services/vocabulary.service';
import {GameLogicService} from '../../../shared/services/game-logic.service';
import {WikiService} from '../../../shared/services/wiki.service';
import {MatchAttempt} from '../../../shared/models/kids.models';

import {DEFAULT_LAST_STAGE, DEFAULT_STAGE_COUNT, DEFAULT_TOTAL_ITEMS} from '../../../shared/game-config.constants';
import {
  expectNewItemsComparedTo,
  expectValidNewGameState,
  expectValidReplayGameState,
  getSortedIDs,
  setGivenStageComplete,
  setupAndValidateEndGameState,
  setupCurrentAndReshuffledGameItems,
  setupGameStart
} from './test-setup-util';


/**
 * Test Suite: Game Flow
 *
 * This test suite focuses on verifying the overall game flow and user interactions,
 * including:
 * - Game completion logic (e.g., detecting when the game is over).
 * - Feedback mechanisms (e.g., tracking correct/incorrect matches).
 * - Modal behavior (e.g., displaying a modal on game end).
 * - Replay functionality (e.g., reshuffling items and resetting the game state).
 * - Starting a new game (e.g., resetting all game data and reshuffling items).
 *
 * While the `MatchWordsService` handles the core game logic, this suite ensures
 * that the game flow integrates correctly with UI elements and user actions.
 */
describe('Game completion, feedback, replay, and new game', () => {
  const finalStage = DEFAULT_LAST_STAGE;
  const totalGameItems = DEFAULT_TOTAL_ITEMS;
  const firstStage = 0;

  let service: MatchWordsService;
  let store: MatchWordsStore;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MatchWordsService,
        MatchWordsStore,
        {provide: VocabularyService, useValue: {}},
        {provide: WikiService, useValue: {}},
        GameLogicService, // if needed
      ],
    });

    service = TestBed.inject(MatchWordsService);
    store = TestBed.inject(MatchWordsStore);
  });

  describe('Game completion', () => {
    it('should update game over on final stage completion', () => {
      expect(service.getGameOverSignal()).toBeFalse();

      setGivenStageComplete(service, store, DEFAULT_STAGE_COUNT - 1);

      expect(service.getGameOverSignal()).toBeTrue();
    });

    it('should NOT update game over on non-final stage completion', () => {
      expect(service.getGameOverSignal()).toBeFalse();

      setGivenStageComplete(service, store, 0);

      expect(service.getGameOverSignal())
        .withContext('Notice: this test fails when manually setting default stages to 1')
        .toBeFalse();
    });

    // todo test when adding modal and changing display on component
    xit('should not display game cards when game over', () => {
    });

    xit('should open modal on game end', () => {
    });
  });

  describe('Game Replay', () => {
    let reShuffleSpy: jasmine.Spy;

    beforeEach(() => {
      setupGameStart(store, service);
      reShuffleSpy = spyOn(service, 'reshuffleCurrentGameItems').and.callThrough();
    });

    it('should reset game state - stages, matched items', () => {

      setupAndValidateEndGameState(service, store, finalStage, totalGameItems);

      service.replayGame();

      expectValidReplayGameState(reShuffleSpy, service, firstStage, store);
    });

    it('should reshuffle current items ( stages * items per stage) when replaying', () => {

      const {endGameItems, replayGameItems} = setupCurrentAndReshuffledGameItems(store, service);

      // reshuffled array should have same length
      expect(replayGameItems.length).toBe(endGameItems.length);
      // reshuffled array should not have the same order as the original
      expect(replayGameItems).not.toEqual(endGameItems);

      //   shuffled array should contain the same game items
      expect(getSortedIDs(replayGameItems)).toEqual(getSortedIDs(endGameItems));
    });

    it('should call reshuffle game items when choosing to replay', () => {
      service.replayGame();
      expect(reShuffleSpy).toHaveBeenCalled();
    });
  });

  describe('New Game', () => {
    beforeEach(() => {
      setupGameStart(store, service);
      setupAndValidateEndGameState(service, store, finalStage, totalGameItems);
    });

    it('should reset game state when starting a new game - all unmatched, first stage', () => {
      service.newGame();

      expectValidNewGameState(service, firstStage, store);
    });

    it('should have a new game items slice array different from the previous', () => {
      const endGameItems = store.shuffledItemsSlice();
      service.newGame();

      expectNewItemsComparedTo(endGameItems, store.shuffledItemsSlice());
    });

    it('should generate cards for new game', () => {
      expect(store.wordCards().length).toBeGreaterThan(0);
      expect(store.imageCards().length).toBeGreaterThan(0);
    });


    it('should clear unique correct match attempt counter on new game', () => {
      const matchAttempts = new Map<number, MatchAttempt>([
        [1, {attempts: 1, correctOnFirstTry: true}],
        [2, {attempts: 2, correctOnFirstTry: false}]
      ]);

      store.uniqueCorrectMatchAttemptCounter.set(matchAttempts);

      expect(store.uniqueCorrectMatchAttemptCounter().size).toBe(2);

      service.newGame();

      expect(store.uniqueCorrectMatchAttemptCounter().size).toBe(0);
    });
  });
});
