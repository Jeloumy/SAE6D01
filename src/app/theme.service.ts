// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ThemeService {
//   private readonly THEME_KEY = 'selected-theme';

//   constructor() {
//     const savedTheme = localStorage.getItem(this.THEME_KEY);
//     if (savedTheme) {
//       this.setTheme(savedTheme);
//     }
//   }

//   setTheme(theme: string) {
//     document.documentElement.setAttribute('data-theme', theme);
//     localStorage.setItem(this.THEME_KEY, theme);
//   }

//   getTheme(): string {
//     return localStorage.getItem(this.THEME_KEY) || 'light';
//   }
// }
