import {Component, effect, OnInit, signal, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {MatchWordsService} from './match-words.service';
import {MatchWordsStore} from './match-words.store';
import {ImageCard, WordCard} from '../../../shared/models/kids.models';
import {EndGameModalComponent} from '../../../shared/components/end-game-modal/end-game-modal.component';
import {Category} from '../../../shared/services/vocabulary.service';
import {DEFAULT_STAGE_COUNT} from '../../../shared/game-config.constants';
import {
  CategoryChooserModalComponent
} from '../../../shared/components/category-chooser-modal/category-chooser-modal.component';

@Component({
  selector: 'app-match-words-game',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, EndGameModalComponent, CategoryChooserModalComponent],
  templateUrl: './match-words-game.component.html',
  styleUrls: ['./match-words-game.component.css']
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

    // todo test
    effect(() => {
      const current = this.store.currentStage();
      if (current !== lastStage) {
        lastStage = current;
        const items = this.store.currentStageItems();
        this.matchWordService.generateGameCardsFromItems(items);
      }
    });
  }


  ngOnInit(): void {
    // todo change
    this.matchWordService.initializeGameData(Category.Animals).subscribe(() => {
      this.matchWordService.initializeGamePlay();
      this.gameReady.set(true);
    });

    // todo set for testing end game modal
    // this.gameOver.set(true);
  }

  onSelectWord(word: WordCard): void {
    this.matchWordService.handleWordSelection(word);
  }

  onSelectImage(image: ImageCard): void {
    this.matchWordService.handleImageSelection(image);
  }

  onNewGame(): void {
    this.matchWordService.newGame();
  }

  onReplayGame() {
    this.matchWordService.replayGame();
  }

  correctCount() {
    return this.matchWordService.countUniqueCorrect();
  }

  totalCount() {
    return this.matchWordService.countTotalItems();
  }

  onChooseCategory() {
    this.categoryModal.open();
  }
}
