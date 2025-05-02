import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteBySoundGameComponent } from './write-by-sound-game.component';

describe('WriteBySoundGameComponent', () => {
  let component: WriteBySoundGameComponent;
  let fixture: ComponentFixture<WriteBySoundGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriteBySoundGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteBySoundGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
