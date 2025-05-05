import {TestBed} from '@angular/core/testing';

import {Category, VocabularyService} from './vocabulary.service';

describe('VocabularyService', () => {
  let service: VocabularyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VocabularyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return animal words', (done: DoneFn) => {
    service.getList(Category.Animals).subscribe(words => {
      expect(words.length).toBeGreaterThan(0); // or exact values if known
      expect(Array.isArray(words)).toBeTrue();
      done();
    });
  });

  it('should return colors words', (done: DoneFn) => {
    service.getList(Category.Colors).subscribe(words => {
      expect(words.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return empty array for invalid category (safety)', (done: DoneFn) => {
    // @ts-ignore to test robustness
    service.getList('not-a-category').subscribe(words => {
      expect(words).toEqual([]);
      done();
    });
  });
});
