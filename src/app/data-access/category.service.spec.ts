import {provideHttpClient} from '@angular/common/http';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

import {CategoryService, FAILED_LOAD_CATEGORIES_MSG} from './category.service';

import {BASE_URL} from '../../environments/environment.local';
import {API_ENDPOINTS} from './api-endpoints';
import validWordGroupResponse from './mocks/valid-word-groups.json';
import {
  CategoryChooserModalComponent
} from '../shared/components/category-chooser-modal/category-chooser-modal.component';
import {MatchWordsService} from '../age-category/kids/match-words-game/match-words.service';
import {WordItem} from './api.models';

const getAllCategoriesUrl: string = BASE_URL + API_ENDPOINTS.WORD_GROUPS;


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

    it('should return an empty array and error message if the request fails', () => {
      spyOn(console, 'error');

      service.getAllWordCategories().subscribe(
        response => {
          expect(response).toEqual([]);
          expect(console.error).toHaveBeenCalledWith(FAILED_LOAD_CATEGORIES_MSG, jasmine.anything());
        }
      );
      const testReq = httpTesting.expectOne(getAllCategoriesUrl);
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

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');

      expect(req.request.headers.get('Authorization')).toContain('Bearer');
      expect(req.request.headers.get('Accept-Language')).toBe('en');
      expect(req.request.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
      expect(req.request.headers.get('Accept')).toBe('application/json');

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
  beforeEach(() => {
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
  });

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

  it('should handle errors with fallback and message to user', fakeAsync(() => {
    chooser.ngOnInit();

    const req = httpTesting.expectOne(getAllCategoriesUrl);
    req.flush('Server error', {status: 500, statusText: 'Internal Server Error'});

    tick();
    fixture.detectChanges();

    const errorMsg = fixture.nativeElement.querySelector('[data-testid="category-error"]');
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.textContent).toContain(FAILED_LOAD_CATEGORIES_MSG);

  }));
  xit('should handle malformed category data with fallback and message to user', () => {

  });

  // it('should ',()=>{});
  // it('should ',()=>{})
});


describe('getAllWordsInGroup', () => {

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


  it('should GET and return all words in a specific group', () => {
    const groupId = 123;
    const expectedUrl = `${BASE_URL}/api/v1/words/groups/${groupId}/words`;

    const mockWord: WordItem = {
      id: 1,
      title: 'Example',
      transcription: 'example',
      sentence: 'This is an example.',
      translate: null,
      date_created: '2024-01-01 00:00:00',
      date_learned: null,
      status: 1,
      cover: {
        id: 101,
        name: 'cover_example.png',
        url: 'https://example.com/image.png'
      }
    };

    const mockResponse = {
      success: true,
      message: '',
      data: {items: [mockWord]}
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
    const expectedUrl = `${BASE_URL}/api/v1/words/groups/${groupId}/words`;

    catService.getAllWordsInGroup(groupId).subscribe();

    const req = httpTesting.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    expect(req.request.headers.get('Accept-Language')).toBe('en');
    expect(req.request.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
    expect(req.request.headers.get('Accept')).toBe('application/json');

    req.flush({success: true, message: '', data: {items: []}});
  });
});
