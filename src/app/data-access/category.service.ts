import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {map} from 'rxjs/operators';
import {catchError, Observable, of} from 'rxjs';

import {ApiResponse, ListData, WordGroup, WordItem} from './api.models';
import {API_ENDPOINTS} from './api-endpoints';
import {BASE_URL, TOKEN} from '../../environments/environment.local';

import {fallbackDataMap} from '../age-category/kids/match-words-game/category-json-mapper';

import allWordGroups from '../../assets/data/all-words-in-categories/all-word-groups.json'

// todo move to msg comp or interceptor
export const FAILED_LOAD_CATEGORIES_MSG = "Couldn't load categories. Please try again later.";

export const FAILED_LOAD_WORDS_MSG = "Couldn't load category words. Returning fallback category.";


const headers = new HttpHeaders({
  Authorization: `Bearer ${TOKEN}`,
  'Accept-Language': 'en',
  'X-Requested-With': 'XMLHttpRequest',
  Accept: 'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl: string = BASE_URL;
  readonly errorMsg = signal<string | null>(null);

  private http: HttpClient = inject(HttpClient);

  constructor() {
  }

  getAllWordCategories(): Observable<WordGroup[]> {
    const url = `${this.baseUrl}${API_ENDPOINTS.WORD_GROUPS}`;

    return this.http.get<ApiResponse<ListData<WordGroup>>>(
      url, {
        headers
      }
    )
      .pipe(
        map(res => res.data.items),
        catchError(err => {
          this.errorMsg.set(FAILED_LOAD_CATEGORIES_MSG);
          console.error(FAILED_LOAD_CATEGORIES_MSG, err);
          return of(this.getAllFallbackGroups());
        })
      );

  }


  getAllWordsInGroup(groupId: number): Observable<WordItem[]> {
    const url = `${this.baseUrl}${API_ENDPOINTS.ALL_WORDS_IN_GROUP(groupId)}`;

    return this.http.get<ApiResponse<WordItem[]>>(
      url, {headers}
    ).pipe(
      map(res => res.data),
      catchError(err => {
        console.error(FAILED_LOAD_WORDS_MSG, err);
        return of(this.getFallbackWordsForGroup(groupId));
      })
    );
  }

  getFallbackWordsForGroup(groupId: number): WordItem[] {
    return fallbackDataMap[groupId] || [];
  }

  private getAllFallbackGroups(): WordGroup[] {
    return allWordGroups.data.items;
  }
}
