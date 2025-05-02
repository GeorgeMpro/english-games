import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSoundsGameComponent } from './match-sounds-game.component';

describe('MatchSoundsGameComponent', () => {
  let component: MatchSoundsGameComponent;
  let fixture: ComponentFixture<MatchSoundsGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchSoundsGameComponent]
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
