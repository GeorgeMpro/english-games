import {TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {provideRouter} from '@angular/router';

describe('HeaderComponent (minimal)', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    });
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
