import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AgeCategoryCardComponent} from './age-category-card/age-category-card.component';

export interface AgeCategory {
  label: string,
  icon: string,
  route: string
}

@Component({
  selector: 'app-age-category',
  imports: [
    RouterLinkActive,
    RouterLink,
    AgeCategoryCardComponent,
    RouterOutlet
  ],
  templateUrl: './age-category.component.html',
  styleUrl: './age-category.component.css'
})
export class AgeCategoryComponent {
  readonly ageCategories: AgeCategory[] = [
    {label: 'Kids', icon: '🧒', route: 'kids'},
    {label: 'Young Adults', icon: '🎓', route: 'young-adults'},
    {label: 'Adults', icon: '👨', route: 'adults'},
    {label: 'Professionals', icon: '💼', route: 'professionals'},
  ];
}
