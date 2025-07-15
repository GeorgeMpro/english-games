import {Component} from '@angular/core';
import {AgeCategoryCardComponent} from './age-category-card/age-category-card.component';
import {AgeCategory} from '../shared/models/kids.models';

@Component({
  selector: 'app-age-category',
  imports: [
    AgeCategoryCardComponent,
  ],
  template:
    `
      <section class="age-categories">
        @for (category of ageCategories; track category.label) {
          <app-age-category-card
            [category]="category"></app-age-category-card>
        }
      </section>
    `,
  styleUrl: './age-category.component.scss'
})
export class AgeCategoryComponent {
  readonly ageCategories: AgeCategory[] = [
    {label: 'Kids', icon: '🧸', route: 'kids'},
    {label: 'Young Adults', icon: '🎒', route: 'young-adults'},
    {label: 'Adults', icon: '🎓', route: 'adults'},
    {label: 'Professionals', icon: '💼', route: 'professionals'},
  ];
}
