import { Component, EventEmitter, Input, Output, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SystemPreferences } from '../models/user-profile';
import { ProfileService } from '../services/profile/profile.service';
import { ThemeService } from '../services/theme/theme.service';
import { MapComponent } from '../pages/map/map.component';

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss'],
})
export class SystemPreferencesComponent implements OnInit, AfterViewInit {
  @Input() preferences: SystemPreferences | null = null;
  @Output() preferencesChange = new EventEmitter<SystemPreferences>();

  @ViewChild(MapComponent) mapComponent!: MapComponent;

  darkModeEnabled: boolean = false;
  highContrastEnabled: boolean = false;

  constructor(
    private profileService: ProfileService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const profile = this.profileService.getCurrentProfile();

    if (profile) {
      if (profile.systemPreferences?.darkMode !== undefined) {
        this.darkModeEnabled = profile.systemPreferences.darkMode;
      } else {
        this.darkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (profile.systemPreferences?.highContrast !== undefined) {
        this.highContrastEnabled = profile.systemPreferences.highContrast;
      }

      this.updatePreferences('darkMode', this.darkModeEnabled);
      this.themeService.setTheme(this.highContrastEnabled ? 'contrast' : (this.darkModeEnabled ? 'dark' : 'light'));
    } else {
      // Charger le thème par défaut si aucun profil n'est sélectionné
      const defaultTheme = this.themeService.getTheme();
      this.themeService.setTheme(defaultTheme);
    }
  }

  ngAfterViewInit(): void {
    this.applyHighContrast(this.highContrastEnabled);
  }

  updatePreferences(key: string, value: any): void {
    if (this.preferences) {
      const newPreferences = { ...this.preferences, [key]: value };
      this.preferences = newPreferences;
      this.preferencesChange.emit(newPreferences);
      this.applyPreferences(newPreferences);
    }
  }

  toggleHighContrast(event: any): void {
    this.highContrastEnabled = event.target.checked;
    this.updatePreferences('highContrast', this.highContrastEnabled);
    this.applyHighContrast(this.highContrastEnabled);
  }

  onThemeChange(event: any, key: string): void {
    const isDarkMode = event.target.checked;
    this.updatePreferences(key, isDarkMode);
    this.darkModeEnabled = isDarkMode; // Mise à jour de darkModeEnabled
    this.themeService.setTheme(isDarkMode ? 'dark' : 'light');
    this.applyMapTheme();
  }

  onSelectChange(event: any, key: string): void {
    const value = event.target.value;
    this.updatePreferences(key, value);
  }

  onCheckboxChange(event: any, key: string): void {
    const value = event.target.checked;
    this.updatePreferences(key, value);
  }

  onColorChange(event: any, key: string): void {
    const value = event.target.value;
    this.updatePreferences(key, value);
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

    if (preferences.highContrast !== undefined) {
      this.applyHighContrast(preferences.highContrast);
    }
  }

  applyHighContrast(enabled: boolean): void {
    if (enabled) {
      this.themeService.setTheme('contrast');
      document.body.classList.add('high-contrast');
      if (this.mapComponent) {
        this.mapComponent.setMapLayer('contrast');
      }
    } else {
      const currentTheme = this.darkModeEnabled ? 'dark' : 'light';
      this.themeService.setTheme(currentTheme);
      document.body.classList.remove('high-contrast');
      if (this.mapComponent) {
        this.mapComponent.setMapLayer(currentTheme);
      }
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

  private applyMapTheme(): void {
    const theme = this.highContrastEnabled ? 'contrast' : (this.darkModeEnabled ? 'dark' : 'light');
    if (this.mapComponent) {
      this.mapComponent.setMapLayer(theme);
    }
  }
}
