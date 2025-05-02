import {Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {KidsComponent} from './age-category/kids/kids.component';
import {MatchWordsGameComponent} from './age-category/kids/match-words-game/match-words-game.component';
import {MatchSoundsGameComponent} from './age-category/kids/match-sounds-game/match-sounds-game.component';
import {WriteBySoundGameComponent} from './age-category/kids/write-by-sound-game/write-by-sound-game.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {label: 'Home Page'}
  },
  {
    path: 'kids',
    component: KidsComponent,
    data: {label: 'Kids Page'},
    children: [
      {path: 'match-words', component: MatchWordsGameComponent, data: {label: 'Match Words Game'}},
      {path: 'match-sounds', component: MatchSoundsGameComponent, data: {label: 'Match Sounds Game'}},
      {path: 'write-by-sound', component: WriteBySoundGameComponent, data: {label: 'Match Sounds Game'}},
    ]
  },
  // todo
  // { path: 'young-adults', component: YoungAdultsComponent },
  // { path: 'adults',      component: AdultsComponent },
  // { path: 'professionals', component: ProfessionalsComponent },
  {path: '**', redirectTo: ''}
];

