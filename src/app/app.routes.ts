import {Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'kids',
    title: 'Kids Page',
    loadChildren: () =>
      import('./age-category/kids/kids.routes').then(module => module.KIDS_ROUTES),
  },
  // todo
  // { path: 'young-adults', component: YoungAdultsComponent },
  // { path: 'adults',      component: AdultsComponent },
  // { path: 'professionals', component: ProfessionalsComponent },
  {path: '**', redirectTo: ''}
];

