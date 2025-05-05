import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


export enum Category {
  Animals = 'animals',
  Colors = 'colors',
  Utensils = 'utensils'
}


@Injectable({
  providedIn: 'root'
})
export class VocabularyService {

  constructor(private http: HttpClient) {
  }

  getList(category: Category): Observable<string[]> {
    return this.http.get<string[]>(`assets/data/${category}.json`);
  }

}
