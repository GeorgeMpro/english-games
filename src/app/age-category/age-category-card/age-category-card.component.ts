import {Component, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AgeCategory} from '../age-category.component';


@Component({
  selector: 'app-age-category-card',
  standalone: true,
  host: {class: 'age-card'},
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './age-category-card.component.html',
  styleUrl: './age-category-card.component.css'
})
export class AgeCategoryCardComponent {
  category = input<AgeCategory>();
}
