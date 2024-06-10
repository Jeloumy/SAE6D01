import { Component } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SAE6D01';

  constructor(private themeService: ThemeService){}

  toggleTheme(){
    const currentTheme = this.themeService.getTheme();
    const newTheme = currentTheme === 'light'?'hightContrast' : 'light';
    this.themeService.setTheme(newTheme);
  }
}
