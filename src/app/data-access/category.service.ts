import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import {BASE_URL} from '../../environments/environment.local';
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
    return this.http.get<ApiResponse<ListData<WordGroup>>>(
      `${this.baseUrl}${API_ENDPOINTS.WORD_GROUPS}`
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
