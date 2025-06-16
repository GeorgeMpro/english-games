import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import animals from '../../../assets/data/animals.json';
import colors from '../../../assets/data/colors.json';
import utensils from '../../../assets/data/utensils.json';
import scenery from '../../../assets/data/scenery.json'
import food from '../../../assets/data/food.json'
import clothes from '../../../assets/data/clothes.json'

export enum Category {
  Animals = 'animals',
  Colors = 'colors',
  Utensils = 'utensils',
  Scenery = 'scenery',
  Food = 'food',
  Clothes = 'clothes',
}

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {

  private readonly wordLists: Record<Category, string[]> = {
    [Category.Animals]: animals,
    [Category.Colors]: colors,
    [Category.Utensils]: utensils,
    [Category.Scenery]: scenery,
    [Category.Food]: food,
    [Category.Clothes]: clothes,
  };

  constructor() {
  }

  getList(category: Category): Observable<string[]> {
    return of(this.wordLists[category] ?? []);
  }

}

