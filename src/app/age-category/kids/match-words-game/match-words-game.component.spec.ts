import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MatchWordsGameComponent} from './match-words-game.component';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';


describe('MatchWordsGameComponent', () => {
  let httpTestingController: HttpTestingController;

  let component: MatchWordsGameComponent;
  let fixture: ComponentFixture<MatchWordsGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatchWordsGameComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();


    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(MatchWordsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
