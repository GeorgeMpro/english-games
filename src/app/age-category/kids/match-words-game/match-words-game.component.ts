import {Component, effect, OnInit, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {DEFAULT_STAGE_COUNT, MatchWordsService} from './match-words.service';
import {Category} from '../../../shared/services/vocabulary.service';
import {MatchWordsStore} from './match-words.store';
import {ImageCard, WordCard} from '../../../shared/models/kids.models';

@Component({
  selector: 'app-match-words-game',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
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



    let lastStage = -1;

    effect(() => {
      const current = this.store.currentStage();
      if (current !== lastStage) {
        lastStage = current;
        const items = this.store.currentStageItems();
        this.matchWordService.setupGameCardsFromItems(items);
      }
    });

  }


  ngOnInit(): void {
    // todo allow passing a specified number of items and items per stage ( items 6 stages 3 is 18)
    // todo work on display of each stage
    // todo add a replay (same items)
    // todo allow new game (new items,maybe more categories)
    this.matchWordService.initializeGameData(Category.Animals).subscribe(success => {
      this.matchWordService.initializeGamePlay();
      this.gameReady.set(success);
    });
  }

  onSelectWord(word: WordCard): void {
    this.matchWordService.selectWord(word);
  }

  onSelectImage(image: ImageCard): void {
    this.matchWordService.selectImage(image);
  }

  protected readonly DEFAULT_STAGE_COUNT = DEFAULT_STAGE_COUNT;
}
