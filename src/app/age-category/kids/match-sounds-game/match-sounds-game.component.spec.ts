import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';


import {MatchSoundsGameComponent} from './match-sounds-game.component';
import {CategoryService} from '../../../data-access/category.service';
import {MatchSoundsWordsService} from '../shared/services/match-sounds-words.service';
import {MatchSoundsStore} from './match-sounds.store';
import {getElementByDataTestId} from '../../../shared/tests/dom-test-utils';
import {EndGameModalComponent} from '../../../shared/components/end-game-modal/end-game-modal.component';
import {By} from '@angular/platform-browser';
import {
  CategoryChooserModalComponent
} from '../../../shared/components/category-chooser-modal/category-chooser-modal.component';
import {WordGroup} from '../../../data-access/api.models';

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
    fixture.detectChanges();

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

describe('Game Play Buttons', () => {
  let soundService: MatchSoundsWordsService;
  let component: MatchSoundsGameComponent;
  let fixture: ComponentFixture<MatchSoundsGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatchSoundsGameComponent,
        EndGameModalComponent
      ],
      providers: [
        MatchSoundsWordsService,
        MatchSoundsStore,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    fixture = TestBed.createComponent(MatchSoundsGameComponent);
    component = fixture.componentInstance;
    soundService = TestBed.inject(MatchSoundsWordsService);
    fixture.detectChanges();
  });

  const scenarios = [
    {testId: 'new-game-button', method: 'newGame',},
    {testId: 'replay-button', method: 'replayGame'},
    {testId: 'choose-button', method: 'openChooser',},
    {testId: 'choose-in-match-button', method: 'openChooser',},
  ]

  scenarios.forEach(s => {
    it(`Clicking ${s.testId} calls ${s.method}`, () => {
      const spy = spyOn(component, s.method as keyof MatchSoundsGameComponent).and.callThrough();
      const store = soundService.getStore();
      store.gameOver.set(true);
      fixture.detectChanges();

      const btn = getElementByDataTestId(fixture, s.testId);
      btn.click();

      expect(btn).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should start new game with chosen categories', () => {
    spyOn(component, 'newCategoriesGame').and.callThrough();

    const chooser = fixture.debugElement.query(By.directive(CategoryChooserModalComponent)).componentInstance as CategoryChooserModalComponent;
    const chosen: WordGroup[] = [
      {id: 1, title: 'Animals'} as WordGroup,
      {id: 2, title: 'Colors'} as WordGroup,
    ];

    chooser.submit.emit(chosen);
    fixture.detectChanges();

    expect(component.newCategoriesGame).toHaveBeenCalledWith(chosen);
    // Optional assertion if you expose a signal for selections:
    // expect(comp.selectedCategories()).toEqual(chosen);
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
describe('display', () => {
  xit('should display game cards with pastel colors');
  xit('should update "matched/unmatched" classes');
  xit('should display end game modal and statistics', () => {
  });
});
