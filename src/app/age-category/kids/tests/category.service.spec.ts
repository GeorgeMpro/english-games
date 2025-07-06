import {provideHttpClient} from '@angular/common/http';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting, TestRequest} from '@angular/common/http/testing';

import {
  CategoryService,
  FAILED_LOAD_CATEGORIES_MSG,
  FAILED_LOAD_WORDS_MSG
} from '../../../data-access/category.service';

import {BASE_URL} from '../../../../environments/environment.local';
import {API_ENDPOINTS} from '../../../data-access/api-endpoints';
import validWordGroupResponse from '../../../../assets/data/all-words-in-categories/all-word-groups.json';
import {
  CategoryChooserModalComponent
} from '../../../shared/components/category-chooser-modal/category-chooser-modal.component';
import {MatchWordsService} from '../match-words-game/match-words.service';
import {mockWord} from './mocks/mock-data';
import {getElementByDataTestId} from '../../../shared/tests/dom-test-utils';
import {animalsGroup} from '../../../shared/game-config.constants';
import wordsFromAnimals from './mocks/valid-words-from-animals-category.json'
import allWordGroups from '../../../../assets/data/all-words-in-categories/all-word-groups.json';

const getAllCategoriesUrl: string = BASE_URL + API_ENDPOINTS.WORD_GROUPS;
const allGroups = allWordGroups.data.items;


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

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should GET and return all categories', () => {

      service.getAllWordCategories().subscribe(result => {
        expect(result).toEqual(validWordGroupResponse.data.items);
      });

      const testReq = httpTesting.expectOne(getAllCategoriesUrl);
      expect(testReq.request.method).toBe('GET');
      testReq.flush(validWordGroupResponse);
    });

    it('should return fallback category and error message if the request fails', () => {
      spyOn(console, 'error');

      service.getAllWordCategories().subscribe(
        response => {
          expect(response).toEqual(allGroups);
          expect(console.error).toHaveBeenCalledWith(FAILED_LOAD_CATEGORIES_MSG, jasmine.anything());
        }
      );
      const testReq = httpTesting.expectOne(getAllCategoriesUrl);
      flushError(testReq);
    });

    it('should return fallback category and error message if response structure is invalid', () => {
      spyOn(console, 'error');

      const malformedResponse = {data: null}; // or missing `items`

      service.getAllWordCategories().subscribe(response => {
        expect(response).toEqual(allGroups);
        expect(console.error).toHaveBeenCalledWith(
          FAILED_LOAD_CATEGORIES_MSG,
          jasmine.anything()
        );
      });

      const req = httpTesting.expectOne(getAllCategoriesUrl);
      req.flush(malformedResponse);
    });


    it('should GET all categories with auth headers', () => {
      const expectedUrl = 'https://api.see.guru/api/v1/words/groups';
      const expectedToken = 'Bearer TEST_TOKEN';

      spyOn<any>(service, 'baseUrl').and.returnValue('https://api.see.guru/api/v1');

      // Replace the token manually in the service file if needed for test
      const patchedService: any = service;
      patchedService.baseUrl = 'https://api.see.guru/api/v1';

      service.getAllWordCategories().subscribe(result => {
        expect(result).toEqual(validWordGroupResponse.data.items);
      });

      const req = expectedHeaders(httpTesting, expectedUrl);

      req.flush(validWordGroupResponse);
    });
  });


  xdescribe('interceptors and headers', () => {
    xit('should add token to outgoing requests', () => {
    });

    // it('should ',()=>{});
    // it('should ',()=>{});
  });
});


describe('Integration with chooser service', () => {
  let fixture: ComponentFixture<CategoryChooserModalComponent>;
  let chooser: CategoryChooserModalComponent;
  let httpTesting: HttpTestingController;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CategoryChooserModalComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    fixture = TestBed.createComponent(CategoryChooserModalComponent);
    chooser = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });

  it('should load categories', fakeAsync(() => {
    chooser.ngOnInit();

    const req = httpTesting.expectOne(getAllCategoriesUrl);
    req.flush(validWordGroupResponse);

    // resolve async subscription
    tick();

    expect(chooser.availableCategories).toEqual(validWordGroupResponse.data.items);
  }));

  // todo pending
  xit('should handle errors with fallback and message to user', fakeAsync(() => {

    chooser.isVisible.set(true);
    chooser.ngOnInit();

    const req = httpTesting.expectOne(getAllCategoriesUrl);
    flushError(req);
    tick();
    fixture.detectChanges();


    const errorMsg = getElementByDataTestId(fixture, 'error-msg');
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.textContent).toContain(FAILED_LOAD_CATEGORIES_MSG);
    httpTesting.verify();
  }));

  xit('should handle malformed category data with fallback and message to user', () => {

  });
});


describe('Handling getting words from categories', () => {

  let matchService: MatchWordsService;
  let catService: CategoryService;
  let httpTesting: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MatchWordsService,
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    matchService = TestBed.inject(MatchWordsService);
    catService = TestBed.inject(CategoryService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });

  it('should handle error response with fallback category', () => {
    catService.getAllWordCategories().subscribe(result => {
      expect(result).toEqual(allGroups);
      expect(catService.errorMsg()).toEqual(FAILED_LOAD_CATEGORIES_MSG);
    })

    const req = httpTesting.expectOne(getAllCategoriesUrl);
    flushError(req);
  });

  it('should GET and return all words in a specific group', () => {
    const groupId = 123;
    const expectedUrl = `${BASE_URL}/words/by-group/${groupId}/all`;

    const mockResponse = {
      success: true,
      message: '',
      data: [mockWord]
    };

    catService.getAllWordsInGroup(groupId).subscribe(result => {
      expect(result).toEqual([mockWord]);
    });

    const req = httpTesting.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should GET all words in group with auth headers', () => {
    const groupId = 20;
    const expectedUrl = `${BASE_URL}/words/by-group/${groupId}/all`;


    catService.getAllWordsInGroup(groupId).subscribe();

    const req = expectedHeaders(httpTesting, expectedUrl);

    req.flush({success: true, message: '', data: {items: []}});
  });


  it('should handle error response and return fallback words and error message', () => {
    const animalsGroupId = 8; // known fallback: Animals
    const expectedUrl = `${BASE_URL}/words/by-group/${animalsGroupId}/all`;
    const fallbackWords = wordsFromAnimals.data;


    spyOn(console, 'error');
    const spy = spyOn(catService, 'getFallbackWordsForGroup').and.returnValue(fallbackWords);

    catService.getAllWordsInGroup(animalsGroupId).subscribe(result => {
      expect(result).toEqual(fallbackWords);
      expect(console.error).toHaveBeenCalledWith(jasmine.stringMatching(FAILED_LOAD_WORDS_MSG), jasmine.anything());
    });

    const req = httpTesting.expectOne(expectedUrl);
    flushError(req);
  });


});

function flushError(req: TestRequest, opts?: {
  status?: number,
  statusText?: string,
  body?: any
}) {
  const {status = 500, statusText = 'Internal Server Error', body = statusText} = opts ?? {};
  req.flush(body, {status, statusText});
}

function expectedHeaders(httpTesting: HttpTestingController, expectedUrl: string) {
  const req = httpTesting.expectOne(expectedUrl);
  expect(req.request.method).toBe('GET');

  expect(req.request.headers.get('Authorization')).toContain('Bearer');
  expect(req.request.headers.get('Accept-Language')).toBe('en');
  expect(req.request.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
  expect(req.request.headers.get('Accept')).toBe('application/json');
  return req;
}
