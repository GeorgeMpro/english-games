import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
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

  // todo cleanup and add doc
  // getItems(words: string[]): Observable<MatchItem[]> {
  //   const params = this.buildParams(words);
  //   return this.http.get<WikiQueryResponse>(this.apiUrl, {params}).pipe(
  //     map(response => this.mapPagesToItems(response.query.pages)),
  //     // todo notice: filters items without images without testing
  //     map(items => items.filter(item => !!item.imageUrl)),
  //
  //     // todo keep or remove?
  //     // catchError(() => of([]))
  //   );
  // }

  getItems(words: string[]): Observable<MatchItem[]> {
    // Notice: silent fail when long queries to wikipedia
    const batchSize = 25;
    const batches: string[][] = [];

    for (let i = 0; i < words.length; i += batchSize) {
      batches.push(words.slice(i, i + batchSize));
    }

    return forkJoin(
      batches.map(batch => this.http.get<WikiQueryResponse>(this.apiUrl, {
        params: this.buildParams(batch)
      }).pipe(
        map(res => this.mapPagesToItems(res.query.pages)),
        map(items => items.filter(item => !!item.imageUrl))
      ))
    ).pipe(
      map(batchResults => batchResults.flat())
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
