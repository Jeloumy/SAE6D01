import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {
  profile: UserProfile = { id: 0, pseudo: '', typeHandicap: '' };
  profiles: UserProfile[] = [];

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.profiles = this.profileService.getProfiles();
    if (this.profiles.length === 1) {
      this.selectProfile(this.profiles[0]);
    }
  }

  createProfile(): void {
    this.profileService.createProfile(this.profile);
    this.profile = { id: 0, pseudo: '', typeHandicap: '' }; // Réinitialisation du formulaire
    this.loadProfiles();  // Recharger les profils après la création d'un nouveau
  }

  selectProfile(profile: UserProfile): void {
    this.profileService.setCurrentProfile(profile);
  }
}
