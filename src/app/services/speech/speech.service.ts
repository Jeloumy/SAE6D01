import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { ProfileService } from '../profile/profile.service';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  constructor(private router: Router, private profileService: ProfileService) {}

  public async checkPermission(): Promise<any> {
    const hasPermission = await SpeechRecognition.checkPermissions().then(
      (state) => {
        return state;
      }
    );
    if (hasPermission.speechRecognition !== 'granted') {
      const permission = await SpeechRecognition.requestPermissions();
      console.log(JSON.stringify(permission));
    }
    return hasPermission;
  }

  async startListening(): Promise<void> {
      const available = await SpeechRecognition['available']();
      console.log('Speech recognition available:', available);
      if (!available) {
        console.log('Speech recognition not available');
        return;
      }
  
      const hasPermission = await this.checkPermission();
      console.log('hasPermission: ', JSON.stringify(hasPermission));
      if (hasPermission.speechRecognition !== 'granted') {
        console.log(
          "Vous devez autoriser l'utilisation du micro par l'application pour utiliser la commande vocale"
        );
        return;
      }
  
      SpeechRecognition.start({
        language: 'fr-FR',
        maxResults: 5,
        prompt: 'Say something',
        popup: true,
        partialResults: true,
      })
        .then((result: any) => {
          console.log('Recognition result:', JSON.stringify(result));
  
          const navigation: { [key: string]: string } = {
            recherche: '',
            'nouveau profil': 'create-profile',
            'modifier profil':
              'edit-profile/' + this.profileService.getCurrentProfile()?.id,
          };
  
          for (const match of result.matches) {
            for (const page in navigation) {
              const regex = new RegExp(page); // Convertir la chaîne de caractères en regex
              if (regex.test(match.toLowerCase())) {
                this.router.navigate([navigation[page]]);
              }
            }
          }
        })
        .catch((error: any) => {
          console.error('Recognition error:', error);
        });
    
    
  }

  stopListening(): void {
    SpeechRecognition.stop()
      .then(() => {
        console.log('Speech recognition stopped');
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  requestPermissions() {
    return SpeechRecognition.requestPermissions();
  }

  async listenForSearch(): Promise<string> {
    const available = await SpeechRecognition['available']();
    if (!available) {
      console.error('Speech recognition not available');
      return '';
    }

    const hasPermission = await this.checkPermission();
    if (hasPermission.speechRecognition !== 'granted') {
      console.error('Permission not granted for speech recognition');
      return '';
    }

    return new Promise((resolve, reject) => {
      SpeechRecognition.start({
        language: 'fr-FR',
        maxResults: 1,
        prompt: 'Dites votre recherche',
        popup: true,
        partialResults: false,
      })
        .then((result: any) => {
          const query = result.matches[0];
          resolve(query);
        })
        .catch((error: any) => {
          console.error('Speech recognition error:', error);
          reject(error);
        });
    });
  }
}
