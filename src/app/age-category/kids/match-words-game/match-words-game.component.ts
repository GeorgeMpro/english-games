import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatchWordsService} from './match-words.service';
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

  constructor(
    private readonly store: MatchWordsStore,
    private readonly matchWordService: MatchWordsService) {
    this.selectedWordId = this.store.selectedWordId;
    this.selectedImageId = this.store.selectedImageId;
    this.message = this.store.message;

    this.items = this.store.items;
    this.words = this.store.words;
    this.images = this.store.images;
  }

  ngOnInit(): void {
    // todo allow passing a specified number of items and items per stage ( items 6 stages 3 is 18)
    // todo work on display of each stage
    // todo add a replay (same items)
    // todo allow new game (new items,maybe more categories)
    this.matchWordService.setupGameItems(Category.Animals);
  }

  onSelectWord(word: WordCard): void {
    this.matchWordService.selectWord(word);
  }

  onSelectImage(image: ImageCard): void {
    this.matchWordService.selectImage(image);
  }
}
