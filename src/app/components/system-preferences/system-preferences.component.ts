import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { SystemPreferences } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';
import { ThemeService } from '../../services/theme/theme.service';

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
      // Vérifier si l'utilisateur a défini une préférence de thème dans son profil
      if (profile.systemPreferences?.darkMode !== undefined) {
        this.darkModeEnabled = profile.systemPreferences.darkMode;
      } else {
        // Si aucune préférence définie, utiliser le thème en fonction du thème système de l'appareil
        this.darkModeEnabled = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
      }

      // Mettre à jour les préférences dans le profil
      this.updatePreferences('darkMode', this.darkModeEnabled);
      // Appliquer le thème
      this.themeService.setTheme(this.darkModeEnabled);
    }
  }

  updatePreferences(key: string, value: any): void {
    if (this.preferences) {
      const newPreferences = { ...this.preferences, [key]: value };
      this.preferences = newPreferences;
      this.preferencesChange.emit(newPreferences);
    }
  }

  onCheckboxChange(event: any, key: string): void {
    this.updatePreferences(key, event.target.checked);
  }

  onRangeChange(event: any, key: string): void {
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
}
