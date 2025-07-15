import { Component } from '@angular/core';
import {AgeCategoryComponent} from '../age-category/age-category.component';

@Component({
  selector: 'app-home',
  imports: [
    AgeCategoryComponent
  ],
  template: `
    <main class="content">
      <section class="hero">
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-subtitle">Choose your learning level:</p>
      </section>
      <app-age-category></app-age-category>
    </main>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title = 'Start Your English Adventure';
}
