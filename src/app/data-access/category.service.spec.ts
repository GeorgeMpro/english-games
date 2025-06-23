import {provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

import {CategoryService, FAILED_LOAD_CATEGORIES_MSG} from './category.service';

import {BASE_URL} from '../../environments/environment.local';
import {API_ENDPOINTS} from './api-endpoints';
import validWordGroupResponse from './mocks/valid-word-groups.json';

describe('CategoryService', () => {
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

  describe('response mapping', () => {
    const getAllCategories: string = BASE_URL + API_ENDPOINTS.WORD_GROUPS;


    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should GET and return all categories', () => {

      service.getAllWordCategories().subscribe(result => {
        expect(result).toEqual(validWordGroupResponse.data.items);
      });

      const testReq = httpTesting.expectOne(getAllCategories);
      expect(testReq.request.method).toBe('GET');
      testReq.flush(validWordGroupResponse);
    });

    it('should return an empty array and error message if the request fails', () => {
      spyOn(console, 'error');

      service.getAllWordCategories().subscribe(
        response => {
          expect(response).toEqual([]);
          expect(console.error).toHaveBeenCalledWith(FAILED_LOAD_CATEGORIES_MSG, jasmine.anything());
        }
      );
      const testReq = httpTesting.expectOne(getAllCategories);
      testReq.flush('Internal Server Error', {status: 500, statusText: 'Server Error'});
    });

    it('should return an empty array and error message if response structure is invalid', () => {
      spyOn(console, 'error');

      const malformedResponse = {data: null}; // or missing `items`

      service.getAllWordCategories().subscribe(response => {
        expect(response).toEqual([]);
        expect(console.error).toHaveBeenCalledWith(
          FAILED_LOAD_CATEGORIES_MSG,
          jasmine.anything()
        );
      });

      const req = httpTesting.expectOne(getAllCategories);
      req.flush(malformedResponse);
    });
  });

  describe('Integration with chooser service', () => {
    xit('should load categories', () => {

    });

    xit('should handle errors with fallback and message to user', () => {

    });

    xit('should handle malformed category data with fallback and message to user', () => {

    });

    // it('should ',()=>{});
    // it('should ',()=>{})
  });

  xdescribe('interceptors and headers', () => {
    xit('should add token to outgoing requests', () => {
    });

    // it('should ',()=>{});
    // it('should ',()=>{});
  });
});


