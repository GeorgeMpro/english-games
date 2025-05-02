import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatchWordsGameComponent} from './match-words-game/match-words-game.component';

@Component({
  selector: 'app-kids',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatchWordsGameComponent
  ],
  templateUrl: './kids.component.html',
  styleUrl: './kids.component.css'
})
export class KidsComponent {

}
