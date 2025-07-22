import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SoundService {

  private isSpeaking = false;

  speak(word: string, rate = 1): void {
    // Cancel queued or active speech immediately
    speechSynthesis.cancel();

    // Create utterance after cancelling
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = rate;

      utterance.onend = () => this.isSpeaking = false;
      utterance.onerror = () => this.isSpeaking = false;

      this.isSpeaking = true;
      speechSynthesis.speak(utterance);
    }, 0);
  }

}
