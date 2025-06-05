import {Component, signal} from '@angular/core';

import {MatChipListbox, MatChipOption} from '@angular/material/chips';

import {DEFAULT_CATEGORY, ERROR_CATEGORIES_MESSAGE} from '../../game-config.constants';

@Component({
  selector: 'app-category-chooser-modal',
  imports: [
    MatChipListbox,
    MatChipOption
  ],
  template: `
    <mat-chip-listbox [multiple]="true">
      @for (category of availableCategories; track category) {
        <mat-chip-option
          [selected]="chosenCategories().includes(category)"
          [attr.data-testid]="'category-'+ category">
          {{ category }}
        </mat-chip-option>
      }

    </mat-chip-listbox>
  `,
  styles: ``
})
export class CategoryChooserModalComponent {
  //  todo
  //   test harness like ( click does what)
  //   render and test
  //   manual make sure

  availableCategories: string[] = [];
  readonly chosenCategories = signal<string[]>([]);
  errorMessage: string = '';

  setupCategories(): string[] {
    if (this.availableCategories.length === 0) {
      // todo display as toast?
      this.errorMessage = ERROR_CATEGORIES_MESSAGE;
      this.availableCategories = [DEFAULT_CATEGORY];
    }
    return this.availableCategories;
  }

  updateChosenCategories(cat: string[]): void {
    if (cat.length !== 0) {
      this.chosenCategories.set(Array.from(new Set([...cat])));
    }
  }

  getChosenCategories(): string[] {
    return this.chosenCategories();
  }

  resetCategories(): void {
    this.chosenCategories.set([]);
  }

  selectCategories(chosenCat: string | string[]): void {
    const catArr = Array.isArray(chosenCat) ? chosenCat : [chosenCat];
    this.updateChosenCategories(catArr);
  }
}
