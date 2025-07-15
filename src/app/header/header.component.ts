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

}
