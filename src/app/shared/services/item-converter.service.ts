import {Injectable} from '@angular/core';
import {MatchItem} from '../models/kids.models';
import {WordItem} from '../../data-access/api.models';

@Injectable({
  providedIn: 'root'
})
export class ItemConverterService {

  constructor() {
  }

  wordItemToMatchItem(item: WordItem): MatchItem {
    return {
      id: item.id,
      word: item.title,
      imageUrl: item.cover.url,
      matched: false
    };
  }

  wordItemsToMatchItems(words: WordItem[]): MatchItem[] {
    const rawItems = words
      .filter(word => word.cover && !!word.cover.url)
      .map(word => {
          return this.wordItemToMatchItem(word);
        }
      );

    return this.assignUniqueIds(rawItems);
  }

  /**
   * Assigns unique sequential IDs to a list of MatchItems.
   *
   * This function ensures that each MatchItem in the array has a unique `id` field,
   * regardless of its original value. This is critical when combining items from
   * multiple categories, where duplicate IDs may exist and cause matching conflicts.
   *
   * The new IDs start from 1 and increment by 1 for each item.
   * All other fields are preserved via object spreading.
   *
   * @param items - The array of MatchItem objects (possibly with duplicate IDs).
   * @returns A new array of MatchItems with unique `id` values assigned.
   */
  assignUniqueIds(items: MatchItem[]): MatchItem[] {
    return items.map((item, index) => ({
      ...item,
      id: index + 1
    }));
  }
}
