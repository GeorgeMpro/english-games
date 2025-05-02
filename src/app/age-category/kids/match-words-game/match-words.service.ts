import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

interface WikiPage {
  title: string;
  thumbnail?: { source: string };
  fullurl: string;
}

interface WikiQueryResponse {
  query: { pages: Record<string, WikiPage> };
}

export interface MatchItem {
  id: number;
  word: string;
  imageUrl: string;
  wikiUrl: string;
  matched: boolean;
}

@Injectable({providedIn: 'root'})
export class MatchWordsService {
  private readonly apiUrl = 'https://en.wikipedia.org/w/api.php';

  constructor(private readonly http: HttpClient) {
  }

  getItems(words: string[]): Observable<MatchItem[]> {
    const params = this.buildParams(words);
    return this.http
      .get<WikiQueryResponse>(this.apiUrl, {params})
      .pipe(
        map(response => this.mapPagesToItems(response.query.pages)),
        // remove items that have no image
        map(items => items.filter(item => !!item.imageUrl)),
        catchError(() => of([]))
      );
  }

  private buildParams(words: string[]): HttpParams {
    return new HttpParams()
      .set('action', 'query')
      .set('format', 'json')
      .set('origin', '*')
      .set('prop', 'pageimages|info')
      .set('piprop', 'thumbnail')
      .set('pithumbsize', '200')
      .set('inprop', 'url')
      .set('titles', words.join('|'));
  }

  private mapPagesToItems(pages: Record<string, WikiPage>): MatchItem[] {
    return Object.values(pages).map((page: WikiPage, index: number) => ({
      id: index + 1,
      word: page.title,
      imageUrl: page.thumbnail?.source || '',
      wikiUrl: page.fullurl,
      matched: false
    }));
  }
}
