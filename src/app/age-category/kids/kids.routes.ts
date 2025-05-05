import {Routes} from '@angular/router';

import {KidsComponent} from './kids.component';
import {MatchWordsGameComponent} from './match-words-game/match-words-game.component';
import {MatchSoundsGameComponent} from './match-sounds-game/match-sounds-game.component';
import {WriteBySoundGameComponent} from './write-by-sound-game/write-by-sound-game.component';

export const KIDS_ROUTES: Routes = [
  {
    path: '',
    // todo add path guard when progress/login
    // path: '',
    // canActivateChild: [ProgressGuard], // one guard for all children
    // children: [
    //   {
    //     path: '', // /kids
    //     component: KidsComponent, // 🎯 landing page
    //     title: 'Kids'
    //   },
    component: KidsComponent,
    title: 'Kids',
    children: [
      {path: 'match-words', component: MatchWordsGameComponent, title: 'Match Words Game'},
      {path: 'match-sounds', component: MatchSoundsGameComponent, title: 'Match Sounds Game'},
      {path: 'write-by-sound', component: WriteBySoundGameComponent, title: 'Write by Sounds Game'},
    ]
  }
];
