import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { UserProfile } from '../../models/definitions';
import { ProfileService } from '../../services/profile/profile.service';
import { Router } from '@angular/router';
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

  constructor(private profileService: ProfileService, private router: Router) {}

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
        this.router.navigate(['/edit-profile', profile.id]); // Rediriger vers la route de modification avec l'ID du profil
        this.profileEdited.emit(profile); // Émettre l'événement pour signaler que le profil a été édité
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

        if (this.currentProfile?.id === profileId) {
          this.currentProfile = null;
          if (this.profiles.length > 0) {
            Swal.fire({
              title: 'Profil supprimé',
              text: 'Le profil sélectionné a été supprimé. Veuillez choisir un autre profil.',
              icon: 'info',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Profil supprimé',
              text: 'Le profil sélectionné a été supprimé. Veuillez créer un nouveau profil.',
              icon: 'info',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/create-profile']);
            });
          }
        } else {
          this.profileDeleted.emit(profileId);
        }
      }
    });
  }

  closeSelector(): void {
    if (!this.currentProfile) {
      Swal.fire({
        title: 'Aucun profil sélectionné',
        text: 'Veuillez sélectionner un profil avant de fermer le sélecteur.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    } else {
      this.close.emit();
    }
  }

  createNewProfile(): void {
    this.router.navigate(['/create-profile']);
  }

  showProfileDetails(profile: UserProfile): void {
    Swal.fire({
      title: `Détails du profil ${profile.username}`,
      html: `
        <strong>Handicaps:</strong>
        <ul>
          ${profile.handicapList.map(handicap => `<li>${handicap.handicap}</li>`).join('')}
        </ul>
        <strong>Dispositifs:</strong>
        <ul>
          ${profile.dispositifLieu.map(dispositif => `<li>${dispositif.name}</li>`).join('')}
        </ul>
      `,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }
}
