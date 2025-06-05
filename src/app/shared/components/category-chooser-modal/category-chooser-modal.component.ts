import {Component, signal} from '@angular/core';
import {DEFAULT_CATEGORY, ERROR_CATEGORIES_MESSAGE} from '../../game-config.constants';
import {filter} from 'rxjs';

@Component({
  selector: 'app-category-chooser-modal',
  imports: [],
  template: `
    <p>
      category-chooser-modal works!
    </p>
  `,
  styles: ``
})
export class CategoryChooserModalComponent {
  //  todo
  //   test logic
  //   test harness like ( click does what)
  //   render and test
  //   manual make sure

  readonly categories = signal<string[]>([]);
  errorMessage: string = '';

  getCategories(): string[] {
    if (this.categories().length === 0) {
      // todo display as toast?
      this.errorMessage = ERROR_CATEGORIES_MESSAGE;
      this.categories.set([DEFAULT_CATEGORY]);
    }
    return this.categories();
  }

  updateCategories(cat: string[]): void {
    if (cat.length !== 0) {
      this.categories.set(Array.from(new Set([...cat])));
    }
  }

  resetCategories() {
    this.categories.set([]);
  }
}
