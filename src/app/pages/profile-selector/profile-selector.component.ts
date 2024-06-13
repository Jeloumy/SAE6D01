import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-profile-selector',
  templateUrl: './profile-selector.component.html',
  styleUrls: ['./profile-selector.component.scss']
})
export class ProfileSelectorComponent {
  @Input() profiles: UserProfile[] = [];
  @Input() currentProfile: UserProfile | null = null;
  @Output() profileSelected = new EventEmitter<UserProfile>();
  @Output() profileEdited = new EventEmitter<UserProfile>();
  @Output() profileDeleted = new EventEmitter<number>();

  selectProfile(profile: UserProfile): void {
    this.profileSelected.emit(profile);
  }

  editProfile(profile: UserProfile): void {
    this.profileEdited.emit(profile);
  }

  deleteProfile(profileId: number): void {
    this.profileDeleted.emit(profileId);
  }
}
