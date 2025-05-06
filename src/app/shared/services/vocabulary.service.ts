import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import animals from '../../../assets/data/animals.json';
import colors from '../../../assets/data/colors.json';
import utensils from '../../../assets/data/utensils.json';

export enum Category {
  Animals = 'animals',
  Colors = 'colors',
  Utensils = 'utensils'
}

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {

  private readonly wordLists: Record<Category, string[]> = {
    [Category.Animals]: animals,
    [Category.Colors]: colors,
    [Category.Utensils]: utensils
  };

  constructor() {
  }

  getList(category: Category): Observable<string[]> {
    return of(this.wordLists[category] ?? []);
  }
}
