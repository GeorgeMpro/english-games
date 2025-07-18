import {TestBed} from '@angular/core/testing';

import {ItemConverterService} from './item-converter.service';

import wordsFromAnimals from '../../age-category/kids/tests/mocks/valid-words-from-animals-category.json';

describe('handling words flow in creating item', () => {
  let conService: ItemConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemConverterService]
    })

    conService = TestBed.inject(ItemConverterService);
  });

  it('should convert match item from backend word', () => {

    const toConvert = wordsFromAnimals.data[1];
    const actual = conService.wordItemToMatchItem(toConvert);
    expect(actual).toEqual(jasmine.objectContaining({
      word: toConvert.title,
      imageUrl: toConvert.cover.url,
      matched: false,
      id: jasmine.any(Number)
    }));

    expect(actual.wikiUrl).toBeUndefined();
  });


  it('should have unique ids for created items', () => {
    const words = [...wordsFromAnimals.data.map(w => ({...w}))];

    // manually create same id scenario
    words.forEach((word) => {
      word.id = 1;
    });

    const matchItems = conService.wordItemsToMatchItems(words);

    const ids = matchItems.map(item => item.id);
    const uniqueIds = new Set(ids);

    expect(words.length).toBeGreaterThan(1); // sanity check
    expect(uniqueIds.size).toBe(ids.length);
    expect(matchItems.length).toBe(words.length);
  });


  it('should filter out words with missing or invalid cover url', () => {
    const input = [
      {...wordsFromAnimals.data[0], cover: null} as any,
      {...wordsFromAnimals.data[1], cover: {url: null}},
      {...wordsFromAnimals.data[2]}, // valid
    ];

    const result = conService.wordItemsToMatchItems(input as any);

    expect(result.length).toBe(1);
    expect(result[0].word).toBe(input[2].title);
  });

});
