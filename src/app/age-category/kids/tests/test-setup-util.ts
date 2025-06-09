import {MatchWordsGameComponent} from '../match-words-game/match-words-game.component';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {MatchWordsService} from '../match-words-game/match-words.service';
import {MatchWordsStore} from '../match-words-game/match-words.store';
import {VocabularyService} from '../../../shared/services/vocabulary.service';
import {of} from 'rxjs';
import {matchItems} from '../../../../assets/test-data/match-items';
import {WikiService} from '../../../shared/services/wiki.service';
import {DeferBlockBehavior, DeferBlockState, TestBed} from '@angular/core/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {provideRouter} from '@angular/router';

export async function setupMatchWordComponentEndGameState() {
  const moduleDef = {
    imports: [MatchWordsGameComponent],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      BrowserTestingModule,
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
  const component = fixture.componentInstance;

  const [deferBlock] = await fixture.getDeferBlocks();
  await deferBlock.render(DeferBlockState.Complete);

  component.gameReady.set(true);
  component.gameOver.set(true); // force modal to show

  fixture.detectChanges();
  return {fixture, component};
}
