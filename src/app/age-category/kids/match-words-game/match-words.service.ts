import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface MatchItem {
  id: number;
  word: string;
  imageUrl: string;
  wikiUrl: string;
  matched: boolean;
}

@Injectable({providedIn: 'root'})
export class MatchWordsService {
  private readonly API = 'https://en.wikipedia.org/w/api.php';

  constructor(private http: HttpClient) {
  }

  getItems(words: string[]): Observable<MatchItem[]> {
    const titles = words.join('|');
    const params = new HttpParams({
      fromObject: {
        action: 'query',
        format: 'json',
        origin: '*',
        prop: 'pageimages|info',
        piprop: 'thumbnail',
        pithumbsize: '200',
        inprop: 'url',
        titles
      }
    });

    return this.http.get<any>(this.API, {params}).pipe(
      map(res => {
        const pages = res.query.pages;
        return Object.values<any>(pages).map((p, idx) => ({
          id: idx + 1,
          word: p.title,
          imageUrl: p.thumbnail?.source ?? '',
          wikiUrl: p.fullurl,
          matched: false
        }));
      })
    );
  }
}
