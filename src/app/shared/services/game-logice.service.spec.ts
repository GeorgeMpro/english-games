import {TestBed} from '@angular/core/testing';

import {GameLogicService} from './game-logic.service';

describe('GameLogicService', () => {
  let service: GameLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameLogicService]
    });
    service = TestBed.inject(GameLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mark matched', () => {
    it('should mark the correct card as matched', () => {
      const cards = [
        {id: 1, matched: false},
        {id: 2, matched: false}
      ];
      const result = service.markMatched(cards, 2);
      expect(result[1].matched).toBeTrue();
      expect(result[0].matched).toBeFalse();
    });
  });

  // setCardMatchFeedback()

  describe('setCardMatchFeedback', () => {
    it('should return ✅ message if correct', () => {
      expect(service.setCardMatchFeedback(true))
        .withContext('Should show success emoji')
        .toContain('✅');
    });
    it('should return ❌ message if incorrect', () => {
      expect(service.setCardMatchFeedback(false))
        .withContext('Should show failure emoji')
        .toContain('❌');
    });
  });

  describe('tryMatchResult', () => {
    it('should return updated cards and correct message when match is correct', () => {
      const wordId = 1;
      const imageId = 1;
      const words = [{id: 1, text: 'cat', matched: false}];
      const images = [{id: 1, url: 'cat.jpg', text: 'cat', matched: false}];

      const result = service.tryMatchResult(wordId, imageId, words, images);

      expect(result?.updatedWords[0].matched).toBeTrue();
      expect(result?.updatedImages[0].matched).toBeTrue();
      expect(result?.message).toContain('✅');
    });

    it('should return unchanged cards and failure message when match is wrong', () => {
      const result = service.tryMatchResult(
        1,
        2,
        [{id: 1, text: 'cat', matched: false}],
        [{id: 2, url: 'dog.jpg', text: 'dog', matched: false}]
      );

      expect(result?.updatedWords[0].matched).toBeFalse();
      expect(result?.updatedImages[0].matched).toBeFalse();
      expect(result?.message).toContain('❌');
    });

    it('should return null if wordId or imageId is undefined', () => {
      const result = service.tryMatchResult(undefined, 1, [], []);
      expect(result).toBeNull();
    });
  });
});
