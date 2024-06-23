import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProfileService } from '../../services/profile/profile.service';
import { UserProfile, Handicap, SystemPreferences } from '../../models/definitions';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SpeechService } from '../../services/speech/speech.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
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
  handicapTypes: Handicap[] = [];
  photoPreview: string | ArrayBuffer | null = '';

  private scrollInterval: any;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private speechService: SpeechService
  ) {}

  ngOnInit(): void {
    this.loadProfiles();
    this.handicapTypes = this.profileService.getHandicapTypes();
    this.resetForm(); // Assurez-vous que le formulaire est vierge au chargement de la page
  }

  get systemPreferences(): SystemPreferences {
    return this.profile.systemPreferences || ({} as SystemPreferences);
  }

  set systemPreferences(value: SystemPreferences) {
    if (this.profile) {
      this.profile.systemPreferences = value;
    }
  }

  loadProfiles(): void {
    this.profiles = this.profileService.getProfilesList();
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
    // Vérification de la limite de 5 profils
    if (this.profiles.length >= 5) {
      Swal.fire({
        icon: 'error',
        title: 'Limite atteinte',
        text: 'Vous ne pouvez pas créer plus de 5 profils.',
      });
      return;
    }

    if (!this.profile.username || this.profile.handicapList.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oups...',
        text: "Le nom d'utilisateur et au moins un type d'handicap sont requis.",
      });
      return;
    }

    const existingProfile = this.profiles.find(p => p.username.toLowerCase() === this.profile.username.toLowerCase());
    if (existingProfile) {
      Swal.fire({
        icon: 'error',
        title: 'Profil existant',
        text: "Un profil avec ce nom d'utilisateur existe déjà. Veuillez choisir un autre nom.",
      });
      return;
    }

    if (!this.profile.photo) {
      const bgColor = this.generateRandomColor().slice(1);
      const avatarUrl = `https://ui-avatars.com/api/?background=${bgColor}&color=fff&name=${encodeURIComponent(this.profile.username)}`;
      this.profile.photo = avatarUrl;
    }

    this.profileService.createProfile(this.profile);
    this.profileService.setCurrentProfile(this.profile); // Sélectionne le nouveau profil comme profil courant
    this.resetForm();
    this.loadProfiles();

    this.router.navigate(['/']);
  }

  onFileChange(event: any): void {
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    const reader = new FileReader();
  
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'Taille du fichier trop grande',
          text: 'La taille du fichier ne doit pas dépasser 5 MB.',
        });
        return;
      }
  
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
    if (this.profileForm) {
      this.profileForm.resetForm();
    }
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  updateSystemPreferences(preferences: SystemPreferences): void {
    this.systemPreferences = preferences;
  }

  startScrollingToTop() {
    this.scrollInterval = setInterval(() => {
      window.scrollBy(0, -10);
    }, 50);
  }

  startScrollingToBottom() {
    this.scrollInterval = setInterval(() => {
      window.scrollBy(0, 10);
    }, 50);
  }

  stopScrolling() {
    clearInterval(this.scrollInterval);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  startListening() {
    this.speechService.startListening();
  }
}
