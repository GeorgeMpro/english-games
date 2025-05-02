import {Component, OnInit, inject} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {MatchWordsService, MatchItem} from './match-words.service';

@Component({
  selector: 'app-match-words-game',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './match-words-game.component.html',
  styleUrls: ['./match-words-game.component.css']
})
export class MatchWordsGameComponent implements OnInit {
  // TODO
  // get shuffle function + indicate how many to return
  // generate a "stage" (1 of 3) to display limited number of items
  // create a "retry" (with same items), "play again" reset all
  // extract as needed

  selectedWordId?: number;
  selectedImageId?: number;
  message = '';
  items: MatchItem[] = [];
  words: Array<{ id: number; text: string; matched: boolean }> = [];
  images: Array<{ id: number; url: string; text: string; matched: boolean }> = [];

  private matchWordService = inject(MatchWordsService);

  ngOnInit(): void {
    // todo extract
    // todo add categories + merge as needed
    const wordList = [
      'Cat', 'Dog', 'Cow', 'Sheep',
      'Elephant', 'Lion', 'Tiger', 'Zebra',
      'Rabbit', 'Duck', 'Horse', 'Pig',
      'Monkey', 'Bear', 'Fish', 'Jellyfish',
      'Donkey', 'Hamster', 'Beaver', 'Jackal',
      'Fox', 'Dolphin', 'Seahorse', 'Starfish',
      'Crab', 'Lizard',
    ];

    this.matchWordService.getItems(wordList).subscribe(items => {
      this.items = items;
      this.setupBoards();
    });
  }

  private setupBoards() {
    this.words = this.shuffle(
      this.items.map(item => ({id: item.id, text: item.word, matched: item.matched})));
    this.images = this.shuffle(
      this.items.map(item => ({id: item.id, url: item.imageUrl, text: item.word, matched: item.matched})));
  }

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  selectWord(word: { id: number; matched: boolean }) {
    if (word.matched) return;
    this.selectedWordId = word.id;
    this.tryMatch();
  }

  selectImage(image: { id: number; matched: boolean }) {
    if (image.matched) return;
    this.selectedImageId = image.id;
    this.tryMatch();
  }

  private tryMatch() {
    let isReadyToMatch = this.selectedWordId != null && this.selectedImageId != null;
    let doesMatch = this.selectedWordId === this.selectedImageId;

    if (isReadyToMatch) {
      if (doesMatch) {
        // todo change to a complete check instead of '!' ?
        this.markMatched(this.selectedWordId!);
        this.message = '✅ Correct!';
      } else {
        this.message = '❌ Try again.';
      }
      setTimeout(() => this.resetSelections(), 800);
    }
  }

  private markMatched(id: number) {
    this.words = this.words.map(word => word.id === id ? {...word, matched: true} : word);
    this.images = this.images.map(image => image.id === id ? {...image, matched: true} : image);
  }

  private resetSelections() {
    this.selectedWordId = undefined;
    this.selectedImageId = undefined;
    this.message = '';
  }
}
