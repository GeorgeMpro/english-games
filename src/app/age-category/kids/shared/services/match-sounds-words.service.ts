import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {CategoryService} from '../../../../data-access/category.service';
import {WordItem} from '../../../../data-access/api.models';

@Injectable({
  providedIn: 'root'
})
export class MatchSoundsWordsService {

  constructor(private catService: CategoryService) {
  }


  getWordsFromCategory(categoryId: number): Observable<WordItem[]> {
    return this.catService.getAllWordsInGroup(categoryId)
  }

  getStore() {
    
  }

  initializeGame(categoryId: number) {
    
  }
}

// TODO
//  get words
//  create a stage
//  display the words
//  can interact with the words
//  progress stages
//  select main word ( the one that is sounded )
