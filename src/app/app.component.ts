import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {IframeModeDirective} from './shared/directives/iframe-mode/iframe-mode.directive';
import {
  CategoryChooserModalComponent
} from './shared/components/category-chooser-modal/category-chooser-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent,],
  template: `@if (!isEmbedded) {
    <app-header data-testid="app-header"/>
  }

  <main class="content">
    <router-outlet></router-outlet>
  </main>

  @if (!isEmbedded) {
    <app-footer data-testid="app-footer"/>
  }
  `,
  styles: ``
})
export class AppComponent {

  readonly isEmbedded: boolean = IframeModeDirective.isEmbedded();
}
