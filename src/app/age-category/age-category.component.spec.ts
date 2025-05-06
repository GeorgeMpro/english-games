import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeCategoryComponent } from './age-category.component';
import {provideRouter} from '@angular/router';

describe('AgeCategoryComponent', () => {
  let component: AgeCategoryComponent;
  let fixture: ComponentFixture<AgeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgeCategoryComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
