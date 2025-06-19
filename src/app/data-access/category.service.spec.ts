import {provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

import {CategoryService} from './category.service';

import {BASE_URL} from '../../environments/environment.local';
import {API_ENDPOINTS} from './api-endpoints';
import validWordGroupResponse from './mocks/valid-word-groups.json';

fdescribe('CategoryService', () => {
  let service: CategoryService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(CategoryService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });

  describe('requests', () => {
    const getAllCategories: string = BASE_URL + API_ENDPOINTS.WORD_GROUPS;

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should send a GET request and return all categories', () => {

      service.getAllWordCategories()
        .subscribe();

      const testReq = httpTesting.expectOne(getAllCategories);
      expect(testReq.request.method).toBe('GET');
      testReq.flush(validWordGroupResponse);
    });


    // it('should ',()=>{});
  });

  xdescribe('interceptors and headers', () => {
    xit('should add token to outgoing requests', () => {
    });
  });
});
