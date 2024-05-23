import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Handicap, DispositifLieu } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  searchQuery: string = '';
  selectedHandicaps: Handicap[] = [];
  selectedDispositifLieu: DispositifLieu[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfilePreferences();
  }

  loadProfilePreferences(): void {
    const currentProfile = this.profileService.getCurrentProfile();
    if (currentProfile) {
      this.selectedHandicaps = currentProfile.handicapList;
      this.selectedDispositifLieu = currentProfile.dispositifLieu;
    }
  }

  onSearch(): void {
    // Logique de recherche à implémenter
    console.log('Recherche effectuée:', this.searchQuery, this.selectedHandicaps, this.selectedDispositifLieu);
  }
}
