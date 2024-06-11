import { Component, OnInit } from '@angular/core';
import { ProfileService } from './services/profile/profile.service';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SAE6D01';
  constructor(
    private profileService: ProfileService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const profile = this.profileService.getCurrentProfile();
    this.themeService.initializeTheme(profile);
  }
}