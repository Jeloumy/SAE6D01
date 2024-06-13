import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserProfile } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent implements OnInit {
  @Input() profile: UserProfile | null = null;
  @Output() profileClicked = new EventEmitter<void>();
  currentProfile: UserProfile | null = null;
  showModal = false;
  photoPreview: string | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadCurrentProfile();
  }

  loadCurrentProfile(): void {
    this.currentProfile = this.profileService.getCurrentProfile();
    this.photoPreview = this.currentProfile?.photo || null;
  }

  getProfilesList(): UserProfile[] {
    return this.profileService.getProfilesList();
  }

  onClick(): void {
    this.profileClicked.emit();
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
    this.closeProfileSelector();
  }
}
