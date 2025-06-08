import {Component, computed, input, output} from '@angular/core';
import {FeedbackMessages} from '../../../../assets/data/feedback-messages';

@Component({
  selector: 'app-end-game-modal',
  imports: [],
  templateUrl: './end-game-modal.component.html',
  styleUrl: '../../styles/app-modal.shared.css'
})
export class EndGameModalComponent {
  readonly totalStars: number = 5;
  readonly correctCount = input<number>(0);
  readonly totalCount = input<number>(0);

  readonly replayClicked = output<void>();
  readonly newGameClicked = output<void>();
  readonly chooseClicked  = output<void>();

  readonly starCount = computed(() => {
    const correct = this.correctCount();
    const total = this.totalCount();
    if (total === 0) {
      return 0;
    }

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
      return this.getRandomFeedbackMsgByCategory(perfect);
    } else if (ratio >= 0.8) {
      return this.getRandomFeedbackMsgByCategory(great);
    } else if (ratio >= 0.5) {
      return this.getRandomFeedbackMsgByCategory(okay);
    } else {
      return this.getRandomFeedbackMsgByCategory(encouragement);
    }
  });

  getRandomFeedbackMsgByCategory(messages: string[]): string {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  // TODO wth?
  protected readonly Array = Array;
}
