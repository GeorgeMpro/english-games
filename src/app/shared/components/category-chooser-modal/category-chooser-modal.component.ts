import {Component, QueryList, ViewChildren, signal, output, OnInit, effect, ViewChild, computed} from '@angular/core';

import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

import {WordGroup} from '../../../data-access/api.models';
import {CategoryService} from '../../../data-access/category.service';

@Component({
  selector: 'app-category-chooser-modal',
  imports: [
    MatChipListbox,
    MatChipOption,
    MatPaginator,
  ],
  template: `
    @if (isVisible()) {
      <div class="app-modal" data-testid="category-chooser-modal">
        <div class="modal-content">
          @if (errorMessage()) {
            <div data-testid="error-msg" class="modal-error">
              {{ errorMessage() }}
            </div>
          }
          <mat-chip-listbox [multiple]="true">
            @for (category of currentPageCategories(); track category) {
              <mat-chip-option
                [selected]="chosenCategories().includes(category)"
                [attr.data-testid]="'category-'+ category"
                [value]="category"
                (selectionChange)="onSelectionChange()">
                {{ category.title }}
              </mat-chip-option>
            }
          </mat-chip-listbox>

          <mat-paginator
            [length]="availableCategories.length"
            [pageSize]="PAGE_SIZE"
            [hidePageSize]="true"
            [pageSizeOptions]="[]"
            (page)="onPageChange($event)">
          </mat-paginator>

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

  readonly PAGE_SIZE: number = 13;
  readonly currentPage = signal(0);
  readonly currentPageCategories = computed(() =>
    this.availableCategories.slice(
      this.currentPage() * this.PAGE_SIZE,
      (this.currentPage() + 1) * this.PAGE_SIZE
    )
  );

  readonly errorMessage = signal<string | null>(null);

  availableCategories: WordGroup[] = [];

  readonly chosenCategories = signal<WordGroup[]>([]);

  readonly isVisible = signal<boolean>(false);
  readonly isOkEnabled = signal(false);
  submit = output<WordGroup[]>();

  @ViewChildren(MatChipOption) chips!: QueryList<MatChipOption>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
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
