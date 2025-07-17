import {Component, ElementRef, signal, ViewChild} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {LucideAngularModule, Moon, Sun} from 'lucide-angular';


@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideAngularModule
  ],
  template: `
    <header class="app-header">
      <div class="header-content">
        <a routerLink="/" class="logo">
          <span class="logo-text">English Games</span>
        </a>

        <div class="nav-actions">
          <nav>
            <ul class="nav-list">
              <li><a routerLink="/kids" routerLinkActive="active">Kids</a></li>
            </ul>
          </nav>

          <!--Toggle-->
          <button data-testid="theme-toggle-button"
                  class="theme-toggle-button"
                  (click)="onThemeToggle()">
            <span #rotator
                  class="rotate-target"
                  [class.rotate-cw]="rotated()"
                  [class.rotate-ccw]="!rotated()">
      @if (isDarkMode()) {
        <lucide-angular [name]="moon" class="theme-icon"/>
      } @else {
        <lucide-angular [name]="sun" class="theme-icon"/>
      }
  </span>
          </button>
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly sun = Sun;
  readonly moon = Moon;
  iconFading = false;
  rotated = signal<boolean>(false);

  @ViewChild('rotator') rotatorRef!: ElementRef<HTMLElement>;

  onThemeToggle(): void {
    this.iconFading = true;
    this.rotated.update(v => !v);
    this.triggerRotate();
    this.toggleTheme();
  }


  isDarkMode(): boolean {
    const element = this.getHTMLElement();
    return element.getAttribute('data-theme') === 'dark';
  }

  private toggleTheme(): void {
    const element = this.getHTMLElement();

    if (this.isDarkMode()) {
      element.removeAttribute('data-theme');
    } else {
      element.setAttribute('data-theme', 'dark');
    }

    this.iconFading = false;
  }

  private triggerRotate(): void {
    const el = this.rotatorRef.nativeElement;
    el.classList.remove('rotate');
    void el.offsetWidth;
    el.classList.add('rotate');
  }

  private getHTMLElement(): HTMLElement {
    return document.documentElement;
  }
}
