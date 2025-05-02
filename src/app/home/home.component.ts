import { Component } from '@angular/core';
import {AgeCategoryComponent} from '../age-category/age-category.component';

@Component({
  selector: 'app-home',
  imports: [
    AgeCategoryComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
