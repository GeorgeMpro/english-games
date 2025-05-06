import {WikiService} from './wiki.service';
import {HttpClient} from '@angular/common/http';
import {WikiQueryResponse} from '../models/kids.models';
import {of} from 'rxjs';

describe('WikiService', () => {
  let service: WikiService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new WikiService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected items', (done: DoneFn) => {
    const fakeResponse: WikiQueryResponse = {
      query: {
        pages: {
          '123': {
            title: 'Cat',
            fullurl: 'https://en.wikipedia.org/wiki/Cat',
            thumbnail: {source: 'https://img.com/cat.jpg'}
          }
        }
      }
    };

    httpClientSpy.get.and.returnValue(of(fakeResponse));

    service.getItems(['Cat']).subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].word).toBe('Cat');
      done();
    });
  });


//   todo handle error, consume, or pass?
});
