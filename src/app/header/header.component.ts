import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <header class="app-header">
      <div class="header-content">
        <a routerLink="/" class="logo">
          <span class="logo-text">English Games</span>
        </a>
        <button data-testid="theme-toggle-button"
                class="theme-toggle-button"
                (click)="onThemeToggle()">
         <span [class.fade-out]="iconFading">
    {{ isDarkMode() ? '☀️' : '🌙' }}
  </span>
        </button>
        <nav>
          <ul class="nav-list">
            <li><a routerLink="/kids" routerLinkActive="active">Kids</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  iconFading = false;

  onThemeToggle(): void {
    this.iconFading = true;

    setTimeout(() => {
      const element = document.documentElement;

      if (this.isDarkMode()) {
        element.removeAttribute('data-theme');
      } else {
        element.setAttribute('data-theme', 'dark');
      }

      this.iconFading = false;
    }, 150);
  }


  isDarkMode() {
    const element: HTMLElement = document.documentElement;
    return element.getAttribute('data-theme') === 'dark';
  }
}
