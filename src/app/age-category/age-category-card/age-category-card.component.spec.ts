import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeCategoryCardComponent } from './age-category-card.component';

describe('AgeCategoryCardComponent', () => {
  let component: AgeCategoryCardComponent;
  let fixture: ComponentFixture<AgeCategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgeCategoryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeCategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
