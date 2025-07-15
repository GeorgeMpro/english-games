import {Component, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {AgeCategory} from '../../shared/models/kids.models';


@Component({
  selector: 'app-age-category-card',
  standalone: true,
  host: {class: 'age-card'},
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './age-category-card.component.html',
  styleUrl: './age-category-card.component.scss'
})
export class AgeCategoryCardComponent {
  category = input<AgeCategory>();
}
