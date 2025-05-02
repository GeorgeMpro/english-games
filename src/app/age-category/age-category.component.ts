import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-age-category',
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './age-category.component.html',
  styleUrl: './age-category.component.css'
})
export class AgeCategoryComponent {

}
