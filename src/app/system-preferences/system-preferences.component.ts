  import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
  import { SystemPreferences } from '../models/user-profile';
  import { ProfileService } from '../services/profile/profile.service';

  @Component({
    selector: 'app-system-preferences',
    templateUrl: './system-preferences.component.html',
    styleUrls: ['./system-preferences.component.scss']
  })
  export class SystemPreferencesComponent implements OnInit {
    @Input() preferences: SystemPreferences | null = null;
    @Output() preferencesChange = new EventEmitter<SystemPreferences>();
    
    constructor(private profileService: ProfileService) {}
    darkModeEnabled: boolean = false;

    
    ngOnInit(): void {
      let profile = this.profileService.getCurrentProfile();

      // Vérifier si l'utilisateur a défini une préférence de thème dans son profil
      if (profile?.systemPreferences?.darkMode !== undefined) {
        this.darkModeEnabled = profile.systemPreferences.darkMode;
      } else {
        // Si aucune préférence définie, utiliser le thème en fonction du thème système de l'appareil
        this.darkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    
      // Mettre à jour les préférences dans le profil
      this.updatePreferences('darkMode', this.darkModeEnabled);
      // Appliquer le thème
      this.setTheme(this.darkModeEnabled);
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
      const isDarkMode = event.target.checked;
      this.setTheme(isDarkMode);
      this.updatePreferences(key, isDarkMode);
    }

    private setTheme(isDarkMode: boolean): void {
      const theme = isDarkMode ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
