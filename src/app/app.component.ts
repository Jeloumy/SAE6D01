import { Component, OnInit } from '@angular/core';
import { ProfileService } from './services/profile/profile.service';
import { ThemeService } from './services/theme/theme.service';
import { SpeechService } from './services/speech/speech.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SAE6D01';
  constructor(
    private profileService: ProfileService,
    private themeService: ThemeService,
    private speechService: SpeechService
  ) {
  }

  ngOnInit(): void {
    this.speechService.checkPermission();
    const profile = this.profileService.getCurrentProfile();
    this.themeService.initializeTheme(profile);
  }

  toggleTheme(){
    const currentTheme = this.themeService.getTheme();
    const newTheme = currentTheme === 'light'?'hightContrast' : 'light';
    this.themeService.setTheme(newTheme);
  }

  startListening(): void {
    console.log('Start listening button clicked');
    this.speechService.startListening();
  }

  stopListening(): void {
    console.log('Stop listening button clicked');
    this.speechService.stopListening();
  }
}