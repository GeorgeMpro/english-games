import {Component, QueryList, ViewChildren, signal, output, OnInit, computed, effect} from '@angular/core';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import {animalsGroup} from '../../game-config.constants';
import {WordGroup} from '../../../data-access/api.models';
import {CategoryService} from '../../../data-access/category.service';

@Component({
  selector: 'app-category-chooser-modal',
  imports: [
    MatChipListbox,
    MatChipOption
  ],
  template: `
    @if (isVisible()) {
      <div class="app-modal" data-testid="category-chooser-modal">
        <div class="modal-content">
          @defer (when errorMessage()) {
            <div data-testid="error-msg" class="modal-error">
              {{ errorMessage() }}
            </div>
          }
          <mat-chip-listbox [multiple]="true">
            @for (category of availableCategories; track category) {
              <mat-chip-option
                [selected]="chosenCategories().includes(category)"
                [attr.data-testid]="'category-'+ category"
                [value]="category"
                (selectionChange)="onSelectionChange()">
                {{ category.title }}
              </mat-chip-option>
            }
          </mat-chip-listbox>

          <button data-testid="cancel-button"
                  (click)="onCancelClick()">
            <span>Cancel</span>
          </button>

          <button data-testid="new-categories-game-button"
                  [disabled]="!isOkEnabled()"
                  (click)="onNewCategoriesGameClick()">
            <span>New Categories Game</span>
          </button>
        </div>
      </div>
    }
  `,
  styleUrl: '../../styles/app-modal.shared.css'
})
export class CategoryChooserModalComponent implements OnInit {

  readonly errorMessage = signal<string | null>(null);

  availableCategories: WordGroup[] = [];

  readonly chosenCategories = signal<WordGroup[]>([]);
  readonly isVisible = signal<boolean>(false);
  readonly isOkEnabled = signal(false);

  submit = output<WordGroup[]>();

  @ViewChildren(MatChipOption) chips!: QueryList<MatChipOption>;

  constructor(private catService: CategoryService) {
    effect(() => {
      this.errorMessage.set(
        this.catService.errorMsg()
      );
    });
  }

  ngOnInit() {
    this.catService.getAllWordCategories().subscribe(
      categories => this.availableCategories = categories
    );

  }


  setupCategories(): WordGroup[] {
    if (this.availableCategories.length === 0) {
      this.availableCategories = [animalsGroup];
    }
    return this.availableCategories;
  }

  updateChosenCategories(cat: WordGroup[]): void {
    if (cat.length !== 0) {
      this.chosenCategories.set(
        Array.from(
          new Map(cat.map(c => [c.id, c])).values()
        ) as WordGroup[]
      );
    }
  }

  getChosenCategories(): WordGroup[] {
    return this.chosenCategories();
  }

  resetChosenCategories(): void {
    this.chosenCategories.set([]);
    this.isOkEnabled.set(false);
  }

  submittedCategories(chosenCat: WordGroup | WordGroup[]): void {
    const catArr = Array.isArray(chosenCat) ? chosenCat : [chosenCat];
    // Convert string[] to WordGroup[] by matching titles in availableCategories
    const selectedWordGroups = this.availableCategories.filter(cat =>
      catArr.includes(cat)
    );
    this.updateChosenCategories(selectedWordGroups);
  }

  onSelectionChange(): void {
    const anySelected = this.chips?.toArray().some(chip => chip.selected) ?? false;
    this.isOkEnabled.set(anySelected);
  }

  onNewCategoriesGameClick(): void {
    const selected = this.chips.toArray()
      .filter(chip => chip.selected)
      .map(chip => chip.value);

    this.submittedCategories(selected);

    // emit the event
    this.submit.emit(selected);

    this.isVisible.set(false);
  }

  onCancelClick() {
    this.isVisible.set(false);
  }

  open(): void {
    this.isVisible.set(true);
  }

  close() {
    this.isVisible.set(false);
    this.resetChosenCategories()
  }

//   TODO
//    add disabled css to the OK button when the button is disabled to notify the user
}
