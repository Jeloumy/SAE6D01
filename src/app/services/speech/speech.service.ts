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

    console.log('je vais entrer dans start');
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
          const motRecherche = 'chercher';
          const regex = new RegExp(motRecherche);
          if (this.router.url === '/' && regex.test(match.toLowerCase())) {
            let index = match.indexOf(motRecherche);

            if (index !== -1) {
              let result = match.substring(index + motRecherche.length).trim();
              console.log(result);
            } else {
              console.log(
                "Le mot 'chercher' n'a pas été trouvé dans la phrase."
              );
            }
            console.log('je suis dans recherche');
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
}
