import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KidsComponent} from './kids.component';
import {provideRouter} from '@angular/router';

describe('KidsComponent', () => {
  let component: KidsComponent;
  let fixture: ComponentFixture<KidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KidsComponent],
      providers: [
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
