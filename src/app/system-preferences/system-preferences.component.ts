import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { SystemPreferences } from '../models/user-profile';
import { ProfileService } from '../services/profile/profile.service';
import { ThemeService } from '../services/theme/theme.service';

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss'],
})
export class SystemPreferencesComponent implements OnInit {
  @Input() preferences: SystemPreferences | null = null;
  @Output() preferencesChange = new EventEmitter<SystemPreferences>();

  darkModeEnabled: boolean = false;

  constructor(
    private profileService: ProfileService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    let profile = this.profileService.getCurrentProfile();

    if (profile) {
      if (profile.systemPreferences?.darkMode !== undefined) {
        this.darkModeEnabled = profile.systemPreferences.darkMode;
      } else {
        this.darkModeEnabled = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
      }

      this.updatePreferences('darkMode', this.darkModeEnabled);
      this.themeService.setTheme(this.darkModeEnabled);
    }
  }

  updatePreferences(key: string, value: any): void {
    if (this.preferences) {
      const newPreferences = { ...this.preferences, [key]: value };
      this.preferences = newPreferences;
      this.preferencesChange.emit(newPreferences);
      this.applyPreferences(newPreferences);
    }
  }

  onCheckboxChange(event: any, key: string): void {
    this.updatePreferences(key, event.target.checked);
  }

  onSelectChange(event: any, key: string): void {
    this.updatePreferences(key, event.target.value);
  }

  onRadioChange(size: string) {
    this.preferences!.textSize = size; // Update textSize based on selected radio button
    // Additional logic if needed
  }

  onColorChange(event: any, key: string): void {
    this.updatePreferences(key, event.target.value);
  }

  onThemeChange(event: any, key: string): void {
    const profile = this.profileService.getCurrentProfile();
    if (profile) {
      const isDarkMode = event.target.checked;
      this.themeService.setTheme(isDarkMode);
      this.updatePreferences(key, isDarkMode);
    }
  }

  applyPreferences(preferences: SystemPreferences): void {
    if (preferences.colorBlindMode) {
      document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
      if (preferences.colorBlindMode) {
        document.body.classList.add(preferences.colorBlindMode);
      }
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
