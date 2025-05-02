import { TestBed } from '@angular/core/testing';

import { MatchWordsService } from './match-words.service';

describe('MatchWordsService', () => {
  let service: MatchWordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchWordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
