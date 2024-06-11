import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProfileService } from '../../services/profile/profile.service';
import {
  UserProfile,
  Handicap,
  DispositifLieu,
  SystemPreferences,
} from '../../models/definitions';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements OnInit {
  @ViewChild('profileForm') profileForm!: NgForm;
  @ViewChild('fileInput') fileInput!: ElementRef;

  profile: UserProfile = {
    id: 0,
    username: '',
    handicapList: [],
    dispositifLieu: [],
    photo: '',
    systemPreferences: {} as SystemPreferences,
  };
  profiles: UserProfile[] = [];
  editingProfile: UserProfile | null = null;
  currentProfile: UserProfile | null = null;
  showModal: boolean = false;
  handicapTypes: Handicap[] = [];
  photoPreview: string | ArrayBuffer | null = '';

  constructor(
    private profileService: ProfileService,
    private http: HttpClient
  ) {} // Inject HttpClient

  ngOnInit(): void {
    this.loadProfiles();
    this.loadCurrentProfile();
    this.handicapTypes = this.profileService.getHandicapTypes();
  }

  get systemPreferences(): SystemPreferences {
    return this.profile.systemPreferences || ({} as SystemPreferences);
  }

  set systemPreferences(value: SystemPreferences) {
    if (this.profile) {
      this.profile.systemPreferences = value;
    }
  }

  reloadCurrentPage(): void {
    location.reload();
  }

  loadProfiles(): void {
    this.profiles = this.profileService.getProfilesList();
  }

  loadCurrentProfile(): void {
    const storedProfile = this.profileService.getCurrentProfile();
    if (storedProfile) {
      const matchedProfile = this.profiles.find(
        (profile) => {
          //console.log('Logging profile:', profile.username, profile);
          return profile.username === storedProfile.username;
        }
      );
      if (matchedProfile) {
        this.selectProfile(matchedProfile, false); // Sélection automatique sans pop-up
      }
    }
  }
  

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  createProfile(): void {
    if (!this.profile.username || this.profile.handicapList.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oups...',
        text: "Le nom d'utilisateur et au moins un type d'handicap sont requis.",
      });
      return;
    }

    if (!this.profile.photo) {
      const bgColor = this.generateRandomColor().slice(1);
      const avatarUrl = `https://ui-avatars.com/api/?background=${bgColor}&color=fff&name=${encodeURIComponent(
        this.profile.username
      )}`;
      this.profile.photo = avatarUrl;
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

  completeProfileCreation(): void {
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

    // Utilisation de SweetAlert2 pour la confirmation de suppression
    Swal.fire({
      title: 'Êtes-vous sûr(e) de vouloir supprimer ce profil ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        // L'utilisateur a confirmé la suppression
        this.profileService.deleteProfile(profileId);
        this.loadProfiles();

        if (wasCurrentProfile) {
          if (this.profiles.length > 0) {
            this.showModal = true;
          } else {
            Swal.fire({
              title: 'Profil supprimé',
              text: 'Le profil sélectionné a été supprimé. Veuillez créer un nouveau profil.',
              icon: 'info',
              confirmButtonText: 'OK',
            });
            this.currentProfile = null;
            this.profileService.setCurrentProfile(null);
          }
        } else if (currentProfilePseudo) {
          const matchedProfile = this.profiles.find(
            (profile) => profile.username === currentProfilePseudo
          );
          if (matchedProfile) {
            this.selectProfile(matchedProfile, false);
          }
        }
      } else {
        Swal.fire('Annulé', "Le profil n'a pas été supprimé.", 'info');
      }
    });
  }

  editProfile(profile: UserProfile): void {
    this.profile = {
      ...profile,
      systemPreferences: profile.systemPreferences || ({} as SystemPreferences),
    };
    this.editingProfile = profile;
    this.photoPreview = profile.photo || '';
  }

  selectProfile(profile: UserProfile, confirmChange: boolean = true): void {
    if (
      confirmChange &&
      this.currentProfile &&
      this.currentProfile.username !== profile.username
    ) {
      Swal.fire({
        title: 'Changer de profil',
        text: 'Êtes-vous sûr(e) de vouloir changer de profil ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          // L'utilisateur a confirmé le changement de profil
          this.currentProfile = {
            ...profile,
            systemPreferences:
              profile.systemPreferences || ({} as SystemPreferences),
          };
          this.profileService.setCurrentProfile(this.currentProfile);
          this.profileService.getCurrentProfile();
          this.profileService.getCurrentProfileSettings();
          location.reload();
        }
      });
    } else {
      this.currentProfile = {
        ...profile,
        systemPreferences:
          profile.systemPreferences || ({} as SystemPreferences),
      };
      this.profileService.setCurrentProfile(this.currentProfile);
    }
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
    this.profile = {
      id: 0,
      username: '',
      handicapList: [],
      dispositifLieu: [],
      photo: '',
      systemPreferences: {} as SystemPreferences,
    };
    this.photoPreview = '';
    this.profileForm.resetForm();
    this.fileInput.nativeElement.value = '';
  }

  updateSystemPreferences(preferences: SystemPreferences): void {
    this.systemPreferences = preferences;
    
  }
}
