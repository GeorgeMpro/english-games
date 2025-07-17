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
        LucideAngularModule.pick({Sun, Moon})
      ],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    const button = fixture.nativeElement.querySelector('[data-testid="theme-toggle-button"]');
    expect(button).toBeTruthy();

    document.documentElement.removeAttribute('data-theme');

    button.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    button.click();
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });


  it('should toggle rotation class on theme toggle', () => {
    const button = getElementByDataTestId(fixture, 'theme-toggle-button');
    const rotator = fixture.nativeElement.querySelector('.rotate-target');

    expect(rotator.classList).toContain('rotate-ccw');

    button.click();
    fixture.detectChanges();

    expect(rotator.classList).toContain('rotate-cw');

    button.click();
    fixture.detectChanges();

    expect(rotator.classList).toContain('rotate-ccw');
  });
});
