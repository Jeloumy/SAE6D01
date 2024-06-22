import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from './services/profile/profile.service';
import { ThemeService } from './services/theme/theme.service';
import { SpeechService } from './services/speech/speech.service';
import { SystemPreferences } from './models/user-profile';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'SAE6D01';
  private preferencesSubscription: Subscription | undefined;
  private profileSubscription: Subscription | undefined;

  constructor(
    private profileService: ProfileService,
    private themeService: ThemeService,
    private speechService: SpeechService,
  ) {
  }

  ngOnInit(): void {
    this.profileSubscription = this.profileService.currentProfile$.subscribe(profile => {
      if (profile && profile.systemPreferences) {
        this.themeService.initializeTheme(profile.systemPreferences);
        this.applyPreferences(profile.systemPreferences);
      }
    });

    this.preferencesSubscription = this.profileService.preferences$.subscribe(preferences => {
      if (preferences) {
        this.applyPreferences(preferences);
      }
    });

    const initialProfile = this.profileService.getCurrentProfile();
    if (initialProfile && initialProfile.systemPreferences) {
      this.themeService.initializeTheme(initialProfile.systemPreferences);
      this.applyPreferences(initialProfile.systemPreferences);
    }
  }

  ngOnDestroy(): void {
    if (this.preferencesSubscription) {
      this.preferencesSubscription.unsubscribe();
    }
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  toggleTheme(): void {
    const currentTheme = this.themeService.getTheme();
    const newTheme = currentTheme === 'light' ? 'highContrast' : 'light';
    this.themeService.setTheme(newTheme);
  }

  startListening(): void {
    console.log('Start listening button clicked');
    this.speechService.startListening();
  }

  stopListening(): void {
    console.log('Stop listening button clicked');
    this.speechService.stopListening();
  }

  applyPreferences(preferences: SystemPreferences): void {
    if (!preferences) return;

    if (preferences.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (preferences.textSize) {
      document.body.style.fontSize = this.getTextSize(preferences.textSize);
    }

    if (preferences.buttonSize) {
      this.applyElementSize(preferences.buttonSize);
    }

    if (preferences.customColors) {
      this.applyCustomColors(preferences.customColors);
    }

    if (preferences.screenReader) {
      // Code pour activer la compatibilité avec les lecteurs d'écran
    }

    if (preferences.voiceCommands) {
      // Code pour activer les commandes vocales
    }

    if (preferences.colorBlindMode) {
      this.applyColorBlindFilter(preferences.colorBlindMode);
    }
  }

  private applyColorBlindFilter(mode: string): void {
    document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (mode) {
      document.body.classList.add(mode);
    }
  }

  private getTextSize(size: string): string {
    switch (size) {
      case 'small':
        return '12px';
      case 'medium':
        return '16px';
      case 'large':
        return '20px';
      default:
        return '16px';
    }
  }

  private applyElementSize(size: string): void {
    const elements = document.querySelectorAll('button, input, select, textarea, .icon');
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      switch (size) {
        case 'small':
          htmlElement.style.fontSize = '12px';
          htmlElement.style.padding = '4px 8px';
          break;
        case 'medium':
          htmlElement.style.fontSize = '16px';
          htmlElement.style.padding = '8px 16px';
          break;
        case 'large':
          htmlElement.style.fontSize = '20px';
          htmlElement.style.padding = '12px 24px';
          break;
        default:
          htmlElement.style.fontSize = '16px';
          htmlElement.style.padding = '8px 16px';
          break;
      }
    });
  }

  private applyCustomColors(colors: { background: string; text: string }): void {
    document.body.style.backgroundColor = colors.background || '#ffffff';
    document.body.style.color = colors.text || '#000000';

    const elements = document.querySelectorAll('button, input, select, textarea, .icon');
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.backgroundColor = colors.background || '#ffffff';
      htmlElement.style.color = colors.text || '#000000';
    });
  }
}
  
