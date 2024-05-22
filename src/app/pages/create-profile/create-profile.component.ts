import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProfileService } from '../../services/profile/profile.service';
import { UserProfile, Handicap } from '../../models/user-profile';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {
  @ViewChild('profileForm') profileForm!: NgForm;

  profile: UserProfile = { id: 0, pseudo: '', typeHandicaps: [] };
  profiles: UserProfile[] = [];
  editingProfile: UserProfile | null = null;
  currentProfile: UserProfile | null = null;
  showModal: boolean = false;
  handicapTypes: Handicap[] = [];

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfiles();
    this.loadCurrentProfile();
    this.handicapTypes = this.profileService.getHandicapTypes();
  }

  loadProfiles(): void {
    this.profiles = this.profileService.getProfilesList();
  }

  loadCurrentProfile(): void {
    const storedProfile = this.profileService.getCurrentProfile();
    if (storedProfile) {
      const matchedProfile = this.profiles.find(profile => profile.pseudo === storedProfile.pseudo);
      if (matchedProfile) {
        this.selectProfile(matchedProfile, false); // Sélection automatique sans pop-up
      }
    }
  }

  createProfile(): void {
    if (!this.profile.pseudo || this.profile.typeHandicaps.length === 0) {
      alert('Pseudo et au moins un type d\'handicap sont requis.');
      return;
    }

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
    this.resetForm();
    this.loadProfiles();
  }

  deleteProfile(profileId: number): void {
    const wasCurrentProfile = this.currentProfile?.id === profileId;
    const currentProfilePseudo = this.currentProfile?.pseudo;
    this.profileService.deleteProfile(profileId);
    this.loadProfiles();

    console.log("Profil supprimé, wasCurrentProfile:", wasCurrentProfile);

    if (wasCurrentProfile) {
      if (this.profiles.length > 0) {
        console.log("Afficher le modal pour la sélection du profil");
        this.showModal = true;
        console.log("showModal:", this.showModal);
      } else {
        alert("Le profil sélectionné a été supprimé. Veuillez créer un nouveau profil.");
        this.currentProfile = null;
        this.profileService.setCurrentProfile(null);
      }
    } else if (currentProfilePseudo) {
      const matchedProfile = this.profiles.find(profile => profile.pseudo === currentProfilePseudo);
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
    if (confirmChange && this.currentProfile && this.currentProfile.pseudo !== profile.pseudo) {
      const userConfirmed = confirm("Êtes-vous sûr de vouloir changer de profil ?");
      if (!userConfirmed) {
        return;
      }
    }
    this.currentProfile = profile;
    this.profileService.setCurrentProfile(profile);
  }

  onProfileSelected(profile: UserProfile | null): void {
    console.log("Profil sélectionné:", profile);
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

  onHandicapChange(handicap: Handicap, event: any): void {
    if (event.target.checked) {
      this.profile.typeHandicaps.push(handicap);
    } else {
      this.profile.typeHandicaps = this.profile.typeHandicaps.filter(h => h.id !== handicap.id);
    }
  }

  resetForm(): void {
    this.profile = { id: 0, pseudo: '', typeHandicaps: [] };
    this.profileForm.resetForm();
  }
}
