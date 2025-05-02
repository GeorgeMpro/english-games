import {Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {KidsComponent} from './age-category/kids/kids.component';
import {MatchWordsGameComponent} from './age-category/kids/match-words-game/match-words-game.component';

const routeConfig: Routes = [
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
      {path: '', redirectTo: 'match-words', pathMatch: 'full'},
      {path: 'match-words', component: MatchWordsGameComponent},
    ]
  },
  // { path: 'young-adults', component: YoungAdultsComponent },
  // { path: 'adults',      component: AdultsComponent },
  // { path: 'professionals', component: ProfessionalsComponent },
  {path: '**', redirectTo: ''}
];

export default routeConfig;
