import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import {BASE_URL, TOKEN} from '../../environments/environment.local';
import {API_ENDPOINTS} from './api-endpoints';
import {ApiResponse, ListData, WordGroup} from './api.models';
import {map} from 'rxjs/operators';

// todo move to msg comp or interceptor
export const FAILED_LOAD_CATEGORIES_MSG = 'Failed to load categories:';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl: string = BASE_URL;
  private http: HttpClient = inject(HttpClient);

  constructor() {
  }

  getAllWordCategories(): Observable<WordGroup[]> {
    const url = `${this.baseUrl}${API_ENDPOINTS.WORD_GROUPS}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${TOKEN}`,
      'Accept-Language': 'en',
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json'
    });
    return this.http.get<ApiResponse<ListData<WordGroup>>>(
      url, {
        headers
      }
    )
      .pipe(
        map(res => res.data.items),
        catchError(err => {
          console.error(FAILED_LOAD_CATEGORIES_MSG, err);
          return of([]);
        })
      );

  }
}
