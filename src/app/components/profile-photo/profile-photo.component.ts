import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfile } from '../../models/definitions';
import { ProfileService } from '../../services/profile/profile.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent implements OnInit, OnDestroy {
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
    if (!this.currentProfile) {
      Swal.fire({
        title: 'Aucun profil sélectionné',
        text: 'Veuillez sélectionner un profil avant de fermer le sélecteur.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    } else {
      this.showModal = false;
    }
  }

  onProfileSelected(profile: UserProfile): void {
    this.currentProfile = profile;
    this.photoPreview = profile.photo || null;
    this.profileService.setCurrentProfile(profile);
    this.closeProfileSelector();
  }

  onProfileEdited(profile: UserProfile): void {
    this.loadProfiles();
  }

  onProfileDeleted(profileId: number): void {
    this.loadProfiles();
    if (this.currentProfile?.id === profileId) {
      this.currentProfile = null;
    }
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
        this.currentProfile!.photo = reader.result as string;
        this.photoPreview = reader.result as string;
      };
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (!this.currentProfile) {
      Swal.fire({
        title: 'Aucun profil sélectionné',
        text: 'Veuillez sélectionner un profil avant de fermer le sélecteur.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    } else {
      this.closeProfileSelector();
    }
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}
