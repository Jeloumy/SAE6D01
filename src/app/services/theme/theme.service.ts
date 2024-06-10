import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {}

  initializeTheme(preferences: any): void {
    let darkModeEnabled = false;

    if (preferences?.systemPreferences?.darkMode !== undefined) {
      darkModeEnabled = preferences.systemPreferences.darkMode;
    } else {
      darkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.setTheme(darkModeEnabled);
  }

  setTheme(isDarkMode: boolean): void {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }
}
