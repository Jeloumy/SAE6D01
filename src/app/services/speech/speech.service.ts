import { Injectable } from '@angular/core';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  constructor() {}

  public async checkPermission(): Promise<any> {
    console.log("j'entre dans checkPermission")
    const hasPermission = await SpeechRecognition.checkPermissions().then(
      state => {
        console.log('////////////////////////////////////////////', state);
        return state;
      }
    );
    if (hasPermission.speechRecognition !== 'granted') {
      const permission = await SpeechRecognition.requestPermissions();
      console.log(JSON.stringify(permission))
    }
    return hasPermission;
  } 

  async startListening(): Promise<void> {
    const available = await SpeechRecognition['available']();
    console.log('Speech recognition available:', available)
    if (!available) {
      console.log('Speech recognition not available');
      return;
    }

    const hasPermission = await this.checkPermission();
    console.log('hasPermission: ', JSON.stringify(hasPermission))
    // if (!hasPermission) {
    //   console.log('Permission not granted');
    //   return;
    // }

    console.log("je vais entrer dans start")
    SpeechRecognition.start({
      language: 'fr-FR',
      maxResults: 5,
      prompt: 'Say something',
      popup: true,
      partialResults: true,
    }).then((result: any) => {
      console.log('Recognition result:', JSON.stringify(result))
    }).catch((error: any) => {
      console.error('Recognition error:', error);
    });
  }

  stopListening(): void {
    SpeechRecognition.stop().then(() => {
      console.log('Speech recognition stopped');
    }).catch((error: any) => {
      console.error(error);
    });
  }

  requestPermissions(){
    return SpeechRecognition.requestPermissions();
  }
}
