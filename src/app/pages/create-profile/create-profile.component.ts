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
  currentProfile: UserProfile | null = null;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfiles();
    this.loadCurrentProfile();
  }

  loadProfiles(): void {
    this.profiles = this.profileService.getProfilesList();
  }

  loadCurrentProfile(): void {
    const storedProfile = this.profileService.getCurrentProfile();
    if (storedProfile) {
      const matchedProfile = this.profiles.find(profile => profile.id === storedProfile.id);
      if (matchedProfile) {
        this.selectProfile(matchedProfile, false); // Sélection automatique sans pop-up
      }
    }
  }

  createProfile(): void {
    const isInitialProfile = this.profiles.length === 0; // Vérifie s'il n'y a pas de profils existants
    if (this.editingProfile) {
      this.profileService.updateProfile(this.profile);
      this.editingProfile = null;
    } else {
      this.profileService.createProfile(this.profile);
      if (isInitialProfile) {
        this.selectProfile(this.profile, false); // Sélectionne automatiquement le nouveau profil
      }
    }
    this.profile = { id: 0, pseudo: '', typeHandicap: '' };
    this.loadProfiles();
  }

  deleteProfile(profileId: number): void {
    this.profileService.deleteProfile(profileId);
    this.loadProfiles();
    if (this.currentProfile?.id === profileId) {
      this.currentProfile = null;
      this.profileService.setCurrentProfile(null);
    }
  }

  editProfile(profile: UserProfile): void {
    this.profile = { ...profile };
    this.editingProfile = profile;
  }

  selectProfile(profile: UserProfile, confirmChange: boolean = true): void {
    if (confirmChange && this.currentProfile && this.currentProfile.id !== profile.id) {
      const userConfirmed = confirm("Êtes-vous sûr de vouloir changer de profil ?");
      if (!userConfirmed) {
        return;
      }
    }
    this.currentProfile = profile;
    this.profileService.setCurrentProfile(profile);
  }
}
