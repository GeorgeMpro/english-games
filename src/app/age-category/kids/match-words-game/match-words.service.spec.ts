import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {MatchWordsService} from './match-words.service';

// TODO
// does not display image & word if does not load an image
// after match cannot press image & word
// can count right/wrong tries

describe('MatchWordsService', () => {
  let service: MatchWordsService;
  describe('MatchWordsService', () => {
    let service: MatchWordsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),            // ← register HttpClient
          provideHttpClientTesting(),     // ← swap in the fake backend
          MatchWordsService
        ]
      });
      service = TestBed.inject(MatchWordsService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

});
