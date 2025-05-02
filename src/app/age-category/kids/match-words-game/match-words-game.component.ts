import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatchWordsService, MatchItem} from './match-words.service';

@Component({
  selector: 'app-match-words-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-words-game.component.html',
  styleUrls: ['./match-words-game.component.css']
})
export class MatchWordsGameComponent implements OnInit {
  items: MatchItem[] = [];
  private svc = inject(MatchWordsService);

  words: Array<{ id: number; text: string; matched: boolean }> = [];
  images: Array<{ id: number; url: string; text: string; matched: boolean }> = [];
  selectedWordId?: number;
  selectedImageId?: number;
  message = '';

  ngOnInit(): void {
    const wordList = [
      'Cat', 'Dog', 'Cow', 'Sheep',
      'Elephant', 'Lion', 'Tiger', 'Zebra',
      'Rabbit', 'Duck', 'Horse', 'Pig',
      'Monkey', 'Bear', 'Fish', 'Jellyfish',
      'Donkey', 'Hamster', 'Beaver', 'Jackal'

    ];

    this.svc.getItems(wordList).subscribe(items => {
      this.items = items;
      this.setupBoards();
    });
  }

  private setupBoards() {
    this.words = this.shuffle(
      this.items.map(i => ({id: i.id, text: i.word, matched: i.matched}))
    );
    this.images = this.shuffle(
      this.items.map(i => ({id: i.id, url: i.imageUrl, text: i.word, matched: i.matched}))
    );
  }

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  selectWord(w: { id: number; matched: boolean }) {
    if (w.matched) return;
    this.selectedWordId = w.id;
    this.tryMatch();
  }

  selectImage(i: { id: number; matched: boolean }) {
    if (i.matched) return;
    this.selectedImageId = i.id;
    this.tryMatch();
  }

  private tryMatch() {
    if (this.selectedWordId != null && this.selectedImageId != null) {
      if (this.selectedWordId === this.selectedImageId) {
        this.markMatched(this.selectedWordId);
        this.message = '✅ Correct!';
      } else {
        this.message = '❌ Try again.';
      }
      setTimeout(() => this.resetSelections(), 800);
    }
  }

  private markMatched(id: number) {
    this.words = this.words.map(w => w.id === id ? {...w, matched: true} : w);
    this.images = this.images.map(i => i.id === id ? {...i, matched: true} : i);
  }

  private resetSelections() {
    this.selectedWordId = undefined;
    this.selectedImageId = undefined;
    this.message = '';
  }
}
