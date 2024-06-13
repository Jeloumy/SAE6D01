import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { UserProfile } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-selector',
  templateUrl: './profile-selector.component.html',
  styleUrls: ['./profile-selector.component.scss']
})
export class ProfileSelectorComponent implements OnInit {
  @Input() profiles: UserProfile[] = [];
  @Input() currentProfile: UserProfile | null = null;
  @Output() profileSelected = new EventEmitter<UserProfile>();
  @Output() profileEdited = new EventEmitter<UserProfile>();
  @Output() profileDeleted = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfiles();
    this.loadCurrentProfile();
  }

  loadProfiles(): void {
    this.profiles = this.profileService.getProfilesList();
  }

  loadCurrentProfile(): void {
    this.currentProfile = this.profileService.getCurrentProfile();
  }

  selectProfile(profile: UserProfile): void {
    if (profile !== this.currentProfile) {
      Swal.fire({
        title: 'Changer de profil',
        text: 'Êtes-vous sûr(e) de vouloir changer de profil ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        if (result.isConfirmed) {
          this.currentProfile = profile;
          this.profileService.setCurrentProfile(profile);
          this.profileSelected.emit(profile);
        }
      });
    }
  }

  editProfile(profile: UserProfile): void {
    Swal.fire({
      title: 'Modifier le profil',
      text: 'Êtes-vous sûr(e) de vouloir modifier ce profil ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.profileEdited.emit(profile);
      }
    });
  }

  deleteProfile(profileId: number): void {
    Swal.fire({
      title: 'Supprimer le profil',
      text: 'Êtes-vous sûr(e) de vouloir supprimer ce profil ? Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.profileService.deleteProfile(profileId);
        this.loadProfiles();
        this.profileDeleted.emit(profileId);
      }
    });
  }

  closeSelector(): void {
    this.close.emit();
  }
}
