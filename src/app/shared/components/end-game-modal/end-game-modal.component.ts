import {Component, EventEmitter, output} from '@angular/core';

@Component({
  selector: 'app-end-game-modal',
  imports: [],
  templateUrl: './end-game-modal.component.html',

  // todo
  styles: [`
    [data-testid="end-game-modal"] {
      position: fixed; /* ✅ FIX: cover viewport regardless of scroll/parent */
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.7); /* semi-transparent dark backdrop */
    }


    .modal-content {
      background-color: var(--color-bg-card);
      padding: var(--space-lg);
      border-radius: var(--card-radius);
      box-shadow: var(--shadow-hover);
      text-align: center;
      width: 100%;
      max-width: 400px;
      font-size: var(--font-size-md);
      color: var(--color-text);
    }

    .modal-content h2 {
      font-size: var(--font-size-lg);
      margin-bottom: var(--space-md);
    }

    .modal-content button {
      font-size: var(--font-size-md);
      padding: var(--space-sm) var(--space-md);
      margin: var(--space-sm);
      border: none;
      border-radius: var(--card-radius);
      background-color: var(--color-primary);
      color: white;
      cursor: pointer;
      transition: background-color 0.2s, box-shadow 0.2s;
    }

    .modal-content button:hover {
      background-color: var(--color-accent);
      box-shadow: var(--shadow-hover);
    } `]

})
export class EndGameModalComponent {
  readonly replayClicked = output<void>();
  readonly newGameClicked = output<void>();
}
