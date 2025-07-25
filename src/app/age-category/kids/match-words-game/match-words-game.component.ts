import {Component, effect, OnInit, signal, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {MatchWordsService} from './match-words.service';
import {MatchWordsStore} from './match-words.store';
import {ImageCard, WordCard} from '../../../shared/models/kids.models';
import {EndGameModalComponent} from '../../../shared/components/end-game-modal/end-game-modal.component';
import {animalsGroup, DEFAULT_STAGE_COUNT} from '../../../shared/game-config.constants';
import {
  CategoryChooserModalComponent
} from '../../../shared/components/category-chooser-modal/category-chooser-modal.component';
import {WordGroup} from '../../../data-access/api.models';

@Component({
  selector: 'app-match-words-game',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    EndGameModalComponent,
    CategoryChooserModalComponent],
  templateUrl: './match-words-game.component.html',
  styleUrls: ['./match-words-game.component.scss']
})
export class MatchWordsGameComponent implements OnInit {
  readonly selectedWordId;
  readonly selectedImageId;
  readonly message;

  readonly items;
  readonly words;
  readonly images;
  readonly stageItems;
  readonly currentStage;
  readonly gameOver;

  // todo image loading
  loadedImageCount = signal<number>(0);
  allImagesLoaded = signal<boolean>(false);

  readonly numberOfStages = DEFAULT_STAGE_COUNT;

  @ViewChild(CategoryChooserModalComponent, {static: true})
  private categoryModal!: CategoryChooserModalComponent;


  readonly gameReady = signal(false);

  constructor(
    private readonly store: MatchWordsStore,
    private readonly matchWordService: MatchWordsService) {

    this.selectedWordId = this.store.selectedWordId;
    this.selectedImageId = this.store.selectedImageId;
    this.message = this.store.matchAttemptMessage;

    this.items = this.store.items;
    this.words = this.store.wordCards;
    this.images = this.store.imageCards;
    this.stageItems = this.store.stageItems;
    this.currentStage = this.store.currentStage;
    this.gameOver = this.store.gameOver;

    let lastStage = -1;

    effect(() => {
      const current = this.store.currentStage();
      if (current !== lastStage) {
        lastStage = current;
        this.resetImageLoading(); // <-- reset for every stage change
        const items = this.store.currentStageItems();
        this.matchWordService.generateGameCardsFromItems(items);
      }
    });
  }

  ngOnInit(): void {
    this.matchWordService.initializeGameData(animalsGroup).subscribe(() => {
      this.matchWordService.initializeGamePlay();
      this.gameReady.set(true);
    });
  }

  getCardColor(index: number): string {
    /* pastel hue via golden angle: index × 137.508° */
    return `hsl(${index * 137.508}, 65%, 65%)`;
  }

  onSelectWord(word: WordCard): void {
    this.matchWordService.handleWordSelection(word);
  }

  onSelectImage(image: ImageCard): void {
    this.matchWordService.handleImageSelection(image);
  }

  onNewGame(): void {
    this.matchWordService.newGame();
    this.resetImageLoading();
  }

  onReplayGame(): void {
    this.matchWordService.replayGame();
    this.resetImageLoading();
  }

  correctCount(): number {
    return this.matchWordService.countUniqueCorrect();
  }

  totalCount(): number {
    return this.matchWordService.countTotalItems();
  }

  // Choosing Category
  onChooseCategory(): void {
    this.categoryModal.open();
  }

  onNewGameWithCategories(categories: WordGroup[]): void {
    this.matchWordService.handleNewCategoriesGame(categories);
    this.resetImageLoading();
  }


  // todo

  fadePlaceholders = signal(false);

  onImageLoad() {
    this.loadedImageCount.set(this.loadedImageCount() + 1);
    if (this.loadedImageCount() === this.images().length) {
      this.fadePlaceholders.set(true);
      setTimeout(() => {
        this.allImagesLoaded.set(true);
        this.fadePlaceholders.set(false);
      }, 300); // match your fade-out duration
    }
  }

// And always call reset logic (see previous message) on stage change/new game.


  resetImageLoading() {
    this.loadedImageCount.set(0);
    this.allImagesLoaded.set(false);
    this.fadePlaceholders.set(false);
  }

}
