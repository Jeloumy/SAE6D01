import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechRecognitionService } from '../speech-recognition.service';

@Component({
  selector: 'app-voice-control',
  templateUrl: './voice-control.component.html',
  styleUrls: ['./voice-control.component.scss']
})
export class VoiceControlComponent implements OnInit, OnDestroy {
  public message: string = '';
  private commandList: { [key: string]: () => void } = {
    'aller à la page d\'accueil': () => this.navigateHome(),
    'ouvrir le menu': () => this.openMenu(),
    'fermer le menu': () => this.closeMenu()
  };

  constructor(private speechRecognitionService: SpeechRecognitionService) {}

  ngOnInit() {
    this.speechRecognitionService.onResult((text: string) => {
      this.message = text;
      this.handleCommand(text);
    });

    this.speechRecognitionService.onError((event: any) => {
      console.error('Speech recognition error', event);
    });

    this.speechRecognitionService.onEnd(() => {
      console.log('Speech recognition ended');
    });

    this.startListening();
  }

  ngOnDestroy() {
    this.stopListening();
  }

  startListening() {
    this.speechRecognitionService.start();
  }

  stopListening() {
    this.speechRecognitionService.stop();
  }

  handleCommand(command: string) {
    if (this.commandList[command]) {
      this.commandList[command]();
    } else {
      console.log(`Command not recognized: ${command}`);
    }
  }

  navigateHome() {
    console.log('Navigating to home page...');
    // Implement your navigation logic here
  }

  openMenu() {
    console.log('Opening menu...');
    // Implement your menu opening logic here
  }

  closeMenu() {
    console.log('Closing menu...');
    // Implement your menu closing logic here
  }
}
