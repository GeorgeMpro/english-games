import {TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {provideRouter} from '@angular/router';
import {getElementByDataTestId} from '../shared/tests/dom-test-utils';
import {LucideAngularModule, Moon, Sun} from 'lucide-angular';

describe('HeaderComponent', () => {

  let fixture: any;
  let component: HeaderComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        LucideAngularModule.pick({ Sun, Moon })
      ],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create header component', () => {
    expect(component).toBeDefined();
  });

  it('should toggle theme on button click', () => {
    spyOn(component, 'onThemeToggle').and.callThrough()

    const btn = getElementByDataTestId(fixture, 'theme-toggle-button');
    expect(btn).toBeTruthy();

    btn.click();

    expect(component.onThemeToggle).toHaveBeenCalled();
  })

  it('should toggle data-theme="dark" on the html element', () => {
    document.documentElement.removeAttribute('data-theme');

    component.onThemeToggle();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    component.onThemeToggle();
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

});
