import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';


import {MatchSoundsGameComponent} from './match-sounds-game.component';
import {CategoryService} from '../../../data-access/category.service';
import {MatchSoundsWordsService} from '../shared/services/match-sounds-words.service';
import {MatchSoundsStore} from './match-sounds.store';

describe('MatchSoundsGameComponent', () => {
  let component: MatchSoundsGameComponent;
  let fixture: ComponentFixture<MatchSoundsGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchSoundsGameComponent],
      providers: [
        MatchSoundsWordsService,
        MatchSoundsStore,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MatchSoundsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


describe('Text to speech util', () => {
  let component: MatchSoundsGameComponent;
  let fixture: ComponentFixture<MatchSoundsGameComponent>;
  let speakSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatchSoundsGameComponent,
      ],
      providers: [
        CategoryService,
        MatchSoundsWordsService,
        MatchSoundsStore,
        provideHttpClient(),
        provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(MatchSoundsGameComponent);
    component = fixture.componentInstance;
    speakSpy = spyOn(window.speechSynthesis, 'speak');
    spyOn(window.speechSynthesis, 'cancel');
    jasmine.clock().install(); // install fake clock
  });

  afterEach(() => {
    jasmine.clock().uninstall(); // clean up
  });

  it('should call speechSynthesis.speak onPlay()', () => {
    component.onPlay();
    jasmine.clock().tick(1); // flush setTimeout
    expect(speakSpy).toHaveBeenCalled();
  });

  it('should call speechSynthesis.speak onSlow()', () => {
    component.onSlow();
    jasmine.clock().tick(1);
    expect(speakSpy).toHaveBeenCalled();
  });
});


describe('MatchSoundsGameComponent', () => {
  it('should get all category words', () => {

  });
  xit('should update main word for each stage');
  xit('', () => {
  });
  xit('', () => {
  });
  xit('', () => {
  });
  xit('', () => {
  });
  xit('', () => {
  });
  xit('', () => {
  });
});
