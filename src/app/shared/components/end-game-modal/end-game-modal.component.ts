import {Component, computed, input, output} from '@angular/core';
import {FeedbackMessages} from '../../../../assets/data/feedback-messages';

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
    }

    .star-rating {
      display: flex;
      gap: 0.2rem;
      justify-content: center;
      font-size: 2rem;
    }

    .star {
      color: #e0e0e0; /* Gray for empty stars */
      transition: color 0.3s ease;
    }

    .star.filled {
      color: #FFD700; /* Gold */
      text-shadow: 0 0 2px #ffecb3,
      0 0 4px #fdd835,
      0 0 6px #fbc02d;
      animation: sparkle 1.2s infinite ease-in-out;
    }

    /* ✨ Sparkling effect using subtle scale + glow pulse */
    @keyframes sparkle {
      0%, 100% {
        text-shadow: 0 0 2px #ffecb3,
        0 0 4px #fdd835,
        0 0 6px #fbc02d;
      }
      50% {
        text-shadow: 0 0 3px #fff176,
        0 0 6px #ffee58,
        0 0 10px #fdd835;
      }
    }

  `]

})
export class EndGameModalComponent {
  readonly correctCount = input<number>(0);
  readonly totalCount = input<number>(0);

  readonly replayClicked = output<void>();
  readonly newGameClicked = output<void>();

  readonly starCount = computed(() => {
    const correct = this.correctCount();
    const total = this.totalCount();
    if (total === 0) return 0;

    return Math.round((correct / total) * 5);
  });

  readonly feedbackMessage = computed(() => {
    const correct = this.correctCount();
    const total = this.totalCount();

    if (total <= 0) {
      return '';
    }

    const ratio = correct / total;
    const {perfect, great, okay, encouragement} = FeedbackMessages;

    if (ratio === 1) {
      return this.getRandomMessage(perfect);
    } else if (ratio >= 0.8) {
      return this.getRandomMessage(great);
    } else if (ratio >= 0.5) {
      return this.getRandomMessage(okay);
    } else {
      return this.getRandomMessage(encouragement);
    }
  });

  getRandomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
  }

}
