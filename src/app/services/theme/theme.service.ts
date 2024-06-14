import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selected-theme';
  private readonly BW_THEME_KEY = 'bw-theme';

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.initializeTheme();
    }

    const bwThemeEnabled = localStorage.getItem(this.BW_THEME_KEY) === 'true';
    if (bwThemeEnabled) {
      this.enableBlackAndWhiteTheme();
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
  }

  getTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }

  enableBlackAndWhiteTheme(): void {
    document.documentElement.classList.add('bw-theme');
    localStorage.setItem(this.BW_THEME_KEY, 'true');
  }

  disableBlackAndWhiteTheme(): void {
    document.documentElement.classList.remove('bw-theme');
    localStorage.setItem(this.BW_THEME_KEY, 'false');
  }

  isBlackAndWhiteThemeEnabled(): boolean {
    return localStorage.getItem(this.BW_THEME_KEY) === 'true';
  }
}