import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements OnInit {
  profile: UserProfile = {
    id: 0,
    username: '',
    handicapList: [{ id: 0, handicap: '' }], 
  };
  profilesList: UserProfile[] = [];
  editingProfile: UserProfile | null = null;
  currentProfile: UserProfile | null = null;
  showModal: boolean = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfiles();
    this.loadCurrentProfile();
  }

  loadProfiles(): void {
    this.profilesList = this.profileService.getProfilesList();
  }

  loadCurrentProfile(): void {
    const storedProfile = this.profileService.getCurrentProfile();
    if (storedProfile) {
      const matchedProfile = this.profilesList.find(
        (profile) => profile.username === storedProfile.username
      );
      if (matchedProfile) {
        this.selectProfile(matchedProfile, false); // Sélection automatique sans pop-up
      }
    }
  }

  createProfile(): void {
    if (!this.profile.username || !this.profile.handicapList) {
      alert("Le nom d'utilisateur et au moins 1 handicap sont requis.");
      return;
    }

    const isInitialProfile = this.profilesList.length === 0; // Vérifie s'il n'y a pas de profils existants
    if (this.editingProfile) {
      this.profileService.updateProfile(this.profile);
      this.editingProfile = null;
    } else {
      this.profileService.createProfile(this.profile);
      if (isInitialProfile) {
        this.selectProfile(this.profile, false); // Sélectionne automatiquement le nouveau profil
      }
    }
  }

  deleteProfile(profileId: number): void {
    const wasCurrentProfile = this.currentProfile?.id === profileId;
    const currentProfilePseudo = this.currentProfile?.username;
    this.profileService.deleteProfile(profileId);
    this.loadProfiles();

    console.log('Profil supprimé, wasCurrentProfile:', wasCurrentProfile);

    if (wasCurrentProfile) {
      if (this.profilesList.length > 0) {
        console.log('Afficher le modal pour la sélection du profil');
        this.showModal = true;
        console.log('showModal:', this.showModal);
      } else {
        alert(
          'Le profil sélectionné a été supprimé. Veuillez créer un nouveau profil.'
        );
        this.currentProfile = null;
        this.profileService.setCurrentProfile(null);
      }
    } else if (currentProfilePseudo) {
      const matchedProfile = this.profilesList.find(
        (profile) => profile.username === currentProfilePseudo
      );
      if (matchedProfile) {
        this.selectProfile(matchedProfile, false);
      }
    }
  }

  editProfile(profile: UserProfile): void {
    this.profile = { ...profile };
    this.editingProfile = profile;
  }

  selectProfile(profile: UserProfile, confirmChange: boolean = true): void {
    if (
      confirmChange &&
      this.currentProfile &&
      this.currentProfile.username !== profile.username
    ) {
      const userConfirmed = confirm(
        'Êtes-vous sûr de vouloir changer de profil ?'
      );
      if (!userConfirmed) {
        return;
      }
    }
    this.currentProfile = profile;
    this.profileService.setCurrentProfile(profile);
  }

  onProfileSelected(profile: UserProfile | null): void {
    console.log('Profil sélectionné:', profile);
    this.showModal = false;
    if (profile) {
      this.selectProfile(profile, false);
    } else {
      this.currentProfile = null;
      this.profileService.setCurrentProfile(null);
    }
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }
}
