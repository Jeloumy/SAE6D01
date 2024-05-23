import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;
  public isListening: boolean = false;

  constructor() {
    const { webkitSpeechRecognition }: any = window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'fr-FR'; // Set your desired language
  }

  start() {
    if (this.isListening) return;
    this.recognition.start();
    this.isListening = true;
  }

  stop() {
    if (!this.isListening) return;
    this.recognition.stop();
    this.isListening = false;
  }

  onResult(callback: (text: string) => void) {
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      callback(transcript);
    };
  }

  onError(callback: (event: any) => void) {
    this.recognition.onerror = callback;
  }

  onEnd(callback: () => void) {
    this.recognition.onend = () => {
      this.isListening = false;
      callback();
    };
  }
}
