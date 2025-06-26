import {Component, QueryList, ViewChildren, signal, output, OnInit, effect, ViewChild, computed} from '@angular/core';

import { MatChipOption} from '@angular/material/chips';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

import {WordGroup} from '../../../data-access/api.models';
import {CategoryService} from '../../../data-access/category.service';
import {DEFAULT_PAGINATION_NUMBER_OF_ITEMS} from '../../game-config.constants';

@Component({
  selector: 'app-category-chooser-modal',
  imports: [
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
          <!--         Notice: <mat-chip-listbox> breaks consistency with pagination-->
          <div class="chip-row">
            @for (category of currentPageCategories(); track category.id) {
              <mat-chip-option
                [selected]="selectedIds().has(category.id)"
                [attr.data-testid]="'category-'+ category.id"
                [value]="category.id"
                (selectionChange)="onChipToggle(category.id, $event.selected)">
                {{ category.title }}
              </mat-chip-option>
            }
          </div>

          <mat-paginator
            data-testid="chips-paginator"
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

  readonly PAGE_SIZE: number = DEFAULT_PAGINATION_NUMBER_OF_ITEMS;
  readonly currentPage = signal(0);
  readonly currentPageCategories = computed(() =>
    this.availableCategories.slice(
      this.currentPage() * this.PAGE_SIZE,
      (this.currentPage() + 1) * this.PAGE_SIZE
    )
  );
  readonly selectedIds = signal<Set<number>>(new Set());

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

  onChipToggle(categoryId: number, selected: boolean): void {
    const ids = new Set(this.selectedIds());
    selected ? ids.add(categoryId) : ids.delete(categoryId);
    this.selectedIds.set(ids);
    this.isOkEnabled.set(ids.size > 0);
  }

  onNewCategoriesGameClick(): void {
    const selected = this.availableCategories.filter(cat => this.selectedIds().has(cat.id));
    this.submit.emit(selected);
    this.isVisible.set(false);
    this.selectedIds.set(new Set()); // Optionally reset
  }

  resetChosenCategories(): void {
    this.selectedIds.set(new Set());
    this.isOkEnabled.set(false);
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


  submittedCategories(chosenCat: WordGroup | WordGroup[]): void {
    const catArr = Array.isArray(chosenCat) ? chosenCat : [chosenCat];
    // Convert string[] to WordGroup[] by matching titles in availableCategories
    const selectedWordGroups = this.availableCategories.filter(cat =>
      catArr.includes(cat)
    );
    this.updateChosenCategories(selectedWordGroups);
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
