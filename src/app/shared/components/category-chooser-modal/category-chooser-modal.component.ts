import {Component, QueryList, signal, ViewChildren} from '@angular/core';

import {MatChipListbox, MatChipOption} from '@angular/material/chips';

import {DEFAULT_CATEGORY, ERROR_CATEGORIES_MESSAGE} from '../../game-config.constants';

@Component({
  selector: 'app-category-chooser-modal',
  imports: [
    MatChipListbox,
    MatChipOption
  ],
  template: `
    <div data-testid="category-chooser-modal">
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
                (click)="onOkClick()">
          <span>Ok</span>
        </button>
      </div>
    </div>
  `,
  // todo extract styling from this and end game
  styles: `
    [data-testid="end-game-modal"] {
      position: fixed; /* ✅ FIX: cover viewport regardless of scroll/parent */
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.7); /* semi-transparent dark backdrop */
    }


    .modal-content {
      background-color: var(--color-bg-card);
      padding: var(--space-lg);
      border-radius: var(--card-radius);
      box-shadow: var(--shadow-hover);
      text-align: center;
      width: 100%;
      max-width: 400px;
      font-size: var(--font-size-md);
      color: var(--color-text);
    }

    .modal-content h2 {
      font-size: var(--font-size-lg);
      margin-bottom: var(--space-md);
    }

    .modal-content button {
      font-size: var(--font-size-md);
      padding: var(--space-sm) var(--space-md);
      margin: var(--space-sm);
      border: none;
      border-radius: var(--card-radius);
      background-color: var(--color-primary);
      color: white;
      cursor: pointer;
      transition: background-color 0.2s, box-shadow 0.2s;
    }

    .modal-content button:hover {
      background-color: var(--color-accent);
      box-shadow: var(--shadow-hover);
    }
  `
})
export class CategoryChooserModalComponent {
  //  todo
  //   test harness like ( click does what)
  //   render and test
  //   manual make sure

  // todo testing
  // availableCategories: string[] = [];


  availableCategories: string[] = ['animals', 'colors', 'utensils'];
  readonly chosenCategories = signal<string[]>([]);
  errorMessage: string = '';

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

  resetCategories(): void {
    this.chosenCategories.set([]);
  }

  submittedCategories(chosenCat: string | string[]): void {
    const catArr = Array.isArray(chosenCat) ? chosenCat : [chosenCat];
    this.updateChosenCategories(catArr);
  }

  onOkClick(): void {
    const selected = this.chips.filter(
      chip => chip.selected)
      .map(chip => chip.value);

    this.submittedCategories(selected);
  //   todo del
    console.log(selected);
    console.log(this.chosenCategories())
  }
}
