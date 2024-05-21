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
  editingProfile: UserProfile | null = null;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.profiles = this.profileService.getProfilesList();
    if (this.profiles.length === 1) {
      this.selectProfile(this.profiles[0]);
    }
  }

  createProfile(): void {
    if (this.editingProfile) {
      this.profileService.updateProfile(this.profile);
      this.editingProfile = null;
    } else {
      this.profileService.createProfile(this.profile);
    }
    this.profile = { id: 0, pseudo: '', typeHandicap: '' };
    this.loadProfiles();
  }

  deleteProfile(profileId: number): void {
    this.profileService.deleteProfile(profileId);
    this.loadProfiles();
  }

  editProfile(profile: UserProfile): void {
    this.profile = {...profile};
    this.editingProfile = profile;
  }

  selectProfile(profile: UserProfile): void {
    this.profileService.setCurrentProfile(profile);
  }
}
