import {provideHttpClientTesting} from '@angular/common/http/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {DeferBlockBehavior, DeferBlockState, TestBed} from '@angular/core/testing';

import {of} from 'rxjs';
import {MatchWordsGameComponent} from '../match-words-game/match-words-game.component';
import {MatchWordsService} from '../match-words-game/match-words.service';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {VocabularyService} from '../../../shared/services/vocabulary.service';
import {matchItems} from '../../../../assets/test-data/match-items';
import {WikiService} from '../../../shared/services/wiki.service';
import {provideRouter} from '@angular/router';

export async function setupMatchWordComponent() {
  const moduleDef = {
    imports: [
      MatchWordsGameComponent,
      BrowserTestingModule,
    ],
    providers: [
      provideHttpClientTesting(),
      provideRouter([]),
      MatchWordsService,
      MatchWordsStore,
      {
        provide: VocabularyService,
        useValue: {getList: () => of(matchItems.map(i => i.word))}
      },
      {
        provide: WikiService,
        useValue: {getItems: () => of(structuredClone(matchItems))}
      }
    ],
    deferBlockBehavior: DeferBlockBehavior.Manual,
  };
  TestBed.configureTestingModule(moduleDef);

  const fixture = TestBed.createComponent(MatchWordsGameComponent);

  const [deferBlock] = await fixture.getDeferBlocks();
  await deferBlock.render(DeferBlockState.Complete);

  fixture.componentInstance.gameReady.set(true);
  return fixture;
}

export async function setupMatchWordComponentEndGameState() {
  const fixture = await setupMatchWordComponent();

  fixture.componentInstance.gameOver.set(true); // force modal to show

  fixture.detectChanges();
  return fixture;
}
