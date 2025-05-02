import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MatchWordsGameComponent} from './match-words-game.component';

describe('MatchWordsGameComponent', () => {
  let component: MatchWordsGameComponent;
  let fixture: ComponentFixture<MatchWordsGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchWordsGameComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MatchWordsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
