import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selected-theme';
  private readonly CONTRAST_THEME_KEY = 'contrast-theme';
  private themeSubject = new BehaviorSubject<string>(this.getSavedTheme());

  themeChange = this.themeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.initializeTheme();
    }

    const contrastThemeEnabled = localStorage.getItem(this.CONTRAST_THEME_KEY) === 'true';
    if (contrastThemeEnabled) {
      this.enableHighContrastTheme();
    } else {
      this.disableHighContrastTheme();
    }
  }

  initializeTheme(preferences?: any): void {
    let darkModeEnabled = false;

    if (preferences?.systemPreferences?.darkMode !== undefined) {
      darkModeEnabled = preferences.systemPreferences.darkMode;
    } else {
      darkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.setTheme(darkModeEnabled);
  }

  setTheme(theme: string): void;
  setTheme(isDarkMode: boolean): void;
  setTheme(themeOrIsDarkMode: string | boolean): void {
    let theme: string;
    if (typeof themeOrIsDarkMode === 'boolean') {
      theme = themeOrIsDarkMode ? 'dark' : 'light';
    } else {
      theme = themeOrIsDarkMode;
    }

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme);  // Notify subscribers of the theme change
  }

  getTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }

  enableHighContrastTheme(): void {
    document.body.classList.add('high-contrast');
    localStorage.setItem(this.CONTRAST_THEME_KEY, 'true');
  }

  disableHighContrastTheme(): void {
    document.body.classList.remove('high-contrast');
    localStorage.setItem(this.CONTRAST_THEME_KEY, 'false');
  }

  isHighContrastThemeEnabled(): boolean {
    return localStorage.getItem(this.CONTRAST_THEME_KEY) === 'true';
  }

  private getSavedTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }
}
