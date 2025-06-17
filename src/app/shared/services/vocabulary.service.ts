import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import animals from '../../../assets/data/animals.json';
import colors from '../../../assets/data/colors.json';
import utensils from '../../../assets/data/utensils.json';
import scenery from '../../../assets/data/scenery.json'
import food from '../../../assets/data/food.json'
import clothes from '../../../assets/data/clothes.json'
import nature from '../../../assets/data/nature.json'
import travel from '../../../assets/data/travel-and-transport.json'
import sport from '../../../assets/data/sports-and-fitness.json'
import city from '../../../assets/data/city-and-architecture.json'

export enum Category {
  Animals = 'animals',
  Colors = 'colors',
  Utensils = 'utensils',
  Scenery = 'scenery',
  Food = 'food',
  Clothes = 'clothes',
  Nature = 'nature',
  Travel = 'travel',
  Sport = 'sport',
  City = 'city',
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
    [Category.Nature]: nature,
    [Category.Travel]: travel,
    [Category.Sport]: sport,
    [Category.City]: city
  };

  constructor() {
  }

  getList(category: Category): Observable<string[]> {
    return of(this.wordLists[category] ?? []);
  }

}

