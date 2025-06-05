import {Component, computed, QueryList, signal, ViewChildren} from '@angular/core';

import {MatChipListbox, MatChipOption} from '@angular/material/chips';

import {DEFAULT_CATEGORY, ERROR_CATEGORIES_MESSAGE} from '../../game-config.constants';

@Component({
  selector: 'app-category-chooser-modal',
  imports: [
    MatChipListbox,
    MatChipOption
  ],
  template: `
    @if (isVisible()) {
      <div class="app-modal"
           data-testid="category-chooser-modal">
        <div class="modal-content">
          <mat-chip-listbox [multiple]="true">
            @for (category of availableCategories; track category) {
              <mat-chip-option
                [selected]="chosenCategories().includes(category)"
                [attr.data-testid]="'category-'+ category"
                [value]="category">
                {{ category }}
              </mat-chip-option>
            }
          </mat-chip-listbox>

          <button data-testid="ok-button"
                  [disabled]="isOkButtonDisabled()"
                  (click)="onOkClick()">
            <span>Ok</span>
          </button>
        </div>
      </div>
    }
  `,
  // todo extract styling from this and end game
  styleUrl: '../../styles/app-modal.shared.css'
})
export class CategoryChooserModalComponent {
  //  todo
  //   test harness like ( click does what)
  //   render and test
  //   manual make sure

  // todo testing
  // availableCategories: string[] = [];


  availableCategories: string[] = ['animals', 'colors', 'utensils'];
  errorMessage: string = '';

  readonly chosenCategories = signal<string[]>([]);
  readonly isVisible = signal<boolean>(false);
  readonly isOkButtonDisabled = computed(() =>
    !this.chips?.some(chip => chip.selected)
  );

  @ViewChildren(MatChipOption) chips!: QueryList<MatChipOption>;

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

  resetChosenCategories(): void {
    this.chosenCategories.set([]);
  }

  submittedCategories(chosenCat: string | string[]): void {
    const catArr = Array.isArray(chosenCat) ? chosenCat : [chosenCat];
    this.updateChosenCategories(catArr);
  }

  onOkClick(): void {
    const selected = this.chips.toArray()
      .filter(chip => chip.selected)
      .map(chip => chip.value);

    this.submittedCategories(selected);
  }

}
