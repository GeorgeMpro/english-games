import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {MatchItem, WikiPage, WikiQueryResponse} from '../models/kids.models';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  private readonly apiUrl: string = 'https://en.wikipedia.org/w/api.php';

  constructor(private readonly http: HttpClient,) {
  }

  /**
   * Fetches Wikipedia page data for an array of words, batching requests to avoid long queries.
   * Each batch retrieves up to 25 words, and items with failing images are filtered out.
   * @param words Array of words to search for on Wikipedia.
   * @returns Observable emitting a flat array of MatchItem objects with image URLs.
   */
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
