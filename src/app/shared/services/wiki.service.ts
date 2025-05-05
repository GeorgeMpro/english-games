import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MatchItem, WikiPage, WikiQueryResponse} from '../models/kids.models';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  private readonly apiUrl = 'https://en.wikipedia.org/w/api.php';

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  getItems(words: string[]): Observable<MatchItem[]> {
    const params = this.buildParams(words);
    return this.http.get<WikiQueryResponse>(this.apiUrl, {params}).pipe(
      map(response => this.mapPagesToItems(response.query.pages)),
      map(items => items.filter(item => !!item.imageUrl)),

      // todo keep or remove?
      // catchError(() => of([]))
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
