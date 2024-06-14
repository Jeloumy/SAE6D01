import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selected-theme';
  private readonly themeSubject = new BehaviorSubject<string>(this.getSavedTheme());

  themeChange = this.themeSubject.asObservable();

  constructor() {
    const savedTheme = this.getSavedTheme();
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

  initializeTheme(preferences?: any): void {
    let darkModeEnabled = false;
    let highContrastEnabled = false;

    if (preferences?.systemPreferences?.darkMode !== undefined) {
      darkModeEnabled = preferences.systemPreferences.darkMode;
    } else {
      darkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (preferences?.systemPreferences?.highContrast !== undefined) {
      highContrastEnabled = preferences.systemPreferences.highContrast;
    }

    if (highContrastEnabled) {
      this.setTheme('contrast');
    } else if (darkModeEnabled) {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme); // Notify subscribers of the theme change
  }

  getTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }

  private getSavedTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }
}
