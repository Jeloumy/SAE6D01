import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { UserProfile, Handicap, SystemPreferences } from '../../models/user-profile';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  @ViewChild('profileForm') profileForm!: NgForm;
  @ViewChild('fileInput') fileInput!: ElementRef;

  photoPreview: string | ArrayBuffer | null = '';
  handicapTypes: Handicap[] = [];
  editingProfile: UserProfile = {
    id: 0,
    username: '',
    handicapList: [],
    dispositifLieu: [],
    photo: '',
    systemPreferences: {} as SystemPreferences,
  };

  private scrollInterval: any;
  
  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute
    
  ) {}

  ngOnInit(): void {
    this.handicapTypes = this.profileService.getHandicapTypes();
    const profileId = this.route.snapshot.paramMap.get('id');
    if (profileId) {
      const profile = this.profileService.getProfilesList().find(p => p.id === +profileId);
      if (profile) {
        this.editingProfile = { ...profile };
        this.photoPreview = this.editingProfile.photo || '';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Le profil n'existe pas.",
        });
        this.router.navigate(['/']);
      }
    }
  }

  get systemPreferences(): SystemPreferences {
    return this.editingProfile.systemPreferences || ({} as SystemPreferences);
  }

  set systemPreferences(value: SystemPreferences) {
    if (this.editingProfile) {
      this.editingProfile.systemPreferences = value;
    }
  }

  updateProfile(): void {
    if (!this.editingProfile.username || this.editingProfile.handicapList.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oups...',
        text: "Le nom d'utilisateur et au moins un type d'handicap sont requis.",
      });
      return;
    }

    if (!this.editingProfile.photo) {
      const bgColor = this.generateRandomColor().slice(1);
      const avatarUrl = `https://ui-avatars.com/api/?background=${bgColor}&color=fff&name=${encodeURIComponent(this.editingProfile.username)}`;
      this.editingProfile.photo = avatarUrl;
    }

    this.profileService.updateProfile(this.editingProfile);
    this.router.navigate(['/']);
  }

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  onFileChange(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (this.editingProfile) {
          this.editingProfile.photo = reader.result as string;
        }
        this.photoPreview = reader.result;
      };
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
}
