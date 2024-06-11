import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserProfile } from '../../models/definitions';

@Component({
  selector: 'app-profile-selector-dialog',
  templateUrl: './profile-selector-dialog.component.html',
  styleUrls: ['./profile-selector-dialog.component.scss']
})
export class ProfileSelectorDialogComponent {
  @Input() profilesList: UserProfile[] = [];
  @Output() selectionConfirmed = new EventEmitter<UserProfile | null>();
  selectedProfile: UserProfile | null = null;

  closeModal(): void {
    this.selectionConfirmed.emit(null);
  }

  confirmSelection(): void {
    this.selectionConfirmed.emit(this.selectedProfile);
  }
}
