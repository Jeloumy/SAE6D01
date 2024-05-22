import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProfileService } from '../../services/profile/profile.service';
import { UserProfile, Handicap, DispositifLieu, SystemPreferences } from '../../models/user-profile';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {
  @ViewChild('profileForm') profileForm!: NgForm;
  @ViewChild('fileInput') fileInput!: ElementRef;

  profile: UserProfile = { id: 0, username: '', handicapList: [], dispositifLieu: [], photo: '', systemPreferences: {} as SystemPreferences };
  profiles: UserProfile[] = [];
  editingProfile: UserProfile | null = null;
  currentProfile: UserProfile | null = null;
  showModal: boolean = false;
  handicapTypes: Handicap[] = [];
  photoPreview: string | ArrayBuffer | null = '';

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfiles();
    this.loadCurrentProfile();
    this.handicapTypes = this.profileService.getHandicapTypes();
  }

  get systemPreferences(): SystemPreferences {
    return this.profile.systemPreferences || {} as SystemPreferences;
  }

  loadProfiles(): void {
    this.profiles = this.profileService.getProfilesList();
  }

  loadCurrentProfile(): void {
    const storedProfile = this.profileService.getCurrentProfile();
    if (storedProfile) {
      const matchedProfile = this.profiles.find(profile => profile.username === storedProfile.username);
      if (matchedProfile) {
        this.selectProfile(matchedProfile, false); // Sélection automatique sans pop-up
      }
    }
  }

  createProfile(): void {
    if (!this.profile.username || this.profile.handicapList.length === 0) {
      alert('username et au moins un type d\'handicap sont requis.');
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
    const currentProfilePseudo = this.currentProfile?.username;
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
      const matchedProfile = this.profiles.find(profile => profile.username === currentProfilePseudo);
      if (matchedProfile) {
        this.selectProfile(matchedProfile, false);
      }
    }
  }

  editProfile(profile: UserProfile): void {
    this.profile = { ...profile, systemPreferences: profile.systemPreferences || {} as SystemPreferences };
    this.editingProfile = profile;
    this.photoPreview = profile.photo || '';
  }

  selectProfile(profile: UserProfile, confirmChange: boolean = true): void {
    if (confirmChange && this.currentProfile && this.currentProfile.username !== profile.username) {
      const userConfirmed = confirm("Êtes-vous sûr de vouloir changer de profil ?");
      if (!userConfirmed) {
        return;
      }
    }
    this.currentProfile = { ...profile, systemPreferences: profile.systemPreferences || {} as SystemPreferences };
    this.profileService.setCurrentProfile(this.currentProfile);
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

  onFileChange(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profile.photo = reader.result as string;
        this.photoPreview = reader.result;
      };
    }
  }

  resetForm(): void {
    this.profile = { id: 0, username: '', handicapList: [], dispositifLieu: [], photo: '', systemPreferences: {} as SystemPreferences };
    this.photoPreview = '';
    this.profileForm.resetForm();
    this.fileInput.nativeElement.value = '';
  }
}
