import {Component} from '@angular/core';
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
        <button class="theme-toggle-button" (click)="onThemeToggle()">
  <span [class.fade-out]="iconFading">
    <span class="rotate-target" [class.rotate]="iconFading">
      @if (isDarkMode()) {
        <lucide-angular [name]="'moon'" class="theme-icon" />
      } @else {
        <lucide-angular [name]="'sun'" class="theme-icon" />
      }
    </span>
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

  onThemeToggle(): void {
    this.iconFading = true;

    setTimeout(() => {
      const element = this.getHTMLElement();

      if (this.isDarkMode()) {
        element.removeAttribute('data-theme');
      } else {
        element.setAttribute('data-theme', 'dark');
      }

      this.iconFading = false;
    }, 200);
  }


  isDarkMode() {
    const element = this.getHTMLElement();
    return element.getAttribute('data-theme') === 'dark';
  }

  private getHTMLElement(): HTMLElement {
    return document.documentElement;
  }
}
