import {Component} from '@angular/core';
import {AgeCategoryCardComponent} from './age-category-card/age-category-card.component';
import {AgeCategory} from '../shared/models/kids.models';

@Component({
  selector: 'app-age-category',
  imports: [
    AgeCategoryCardComponent,
  ],
  templateUrl: './age-category.component.html',
  styleUrl: './age-category.component.css'
})
export class AgeCategoryComponent {
  readonly ageCategories: AgeCategory[] = [
    {label: 'Kids', icon: '🧸', route: 'kids'},
    {label: 'Young Adults', icon: '🎒', route: 'young-adults'},
    {label: 'Adults', icon: '🎓', route: 'adults'},
    {label: 'Professionals', icon: '💼', route: 'professionals'},
  ];
}
