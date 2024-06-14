import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent implements OnInit {
  profiles: UserProfile[] = [];
  currentProfile: UserProfile | null = null;
  showModal = false;
  photoPreview: string | null = null;

  private profileSubscription: Subscription | undefined;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileSubscription = this.profileService.currentProfile$.subscribe(profile => {
      this.currentProfile = profile;
      this.photoPreview = profile?.photo || null;
    });
    this.loadProfiles();
    this.loadCurrentProfile();
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  loadProfiles(): void {
    this.profiles = this.profileService.getProfilesList();
  }

  loadCurrentProfile(): void {
    this.currentProfile = this.profileService.getCurrentProfile();
    this.photoPreview = this.currentProfile?.photo || null;
  }

  onClick(): void {
    this.openProfileSelector();
  }

  openProfileSelector(): void {
    this.showModal = true;
  }

  closeProfileSelector(): void {
    this.showModal = false;
  }

  onProfileSelected(profile: UserProfile): void {
    this.currentProfile = profile;
    this.photoPreview = profile.photo || null;
    this.profileService.setCurrentProfile(profile);
    // Ne pas fermer le sélecteur ici pour rester sur la même page
  }

  onProfileEdited(profile: UserProfile): void {
    // Logique après modification du profil
    this.loadProfiles(); // Recharger la liste des profils
  }

  onProfileDeleted(profileId: number): void {
    // Logique après suppression du profil
    this.loadProfiles(); // Recharger la liste des profils
    if (this.currentProfile?.id === profileId) {
      this.currentProfile = null;
    }
  }
}
