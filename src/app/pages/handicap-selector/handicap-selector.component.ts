import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Handicap, Preference } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-handicap-selector',
  templateUrl: './handicap-selector.component.html',
  styleUrls: ['./handicap-selector.component.scss']
})
export class HandicapSelectorComponent implements OnInit {
  @Input() selectedHandicaps: Handicap[] = [];
  @Output() selectedHandicapsChange = new EventEmitter<Handicap[]>();
  @Output() selectedPreferencesChange = new EventEmitter<Preference[]>();
  handicapTypes: Handicap[] = [];
  preferences: Preference[] = [];
  showPreferences: boolean = false;
  selectedPreferences: Preference[] = [];

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.handicapTypes = this.profileService.getHandicapTypes();
    this.preferences = this.profileService.getPreferences();
  }

  onHandicapChange(handicap: Handicap, event: any): void {
    if (event.target.checked) {
      this.selectedHandicaps.push(handicap);
    } else {
      this.selectedHandicaps = this.selectedHandicaps.filter(h => h.id !== handicap.id);
    }
    this.selectedHandicapsChange.emit(this.selectedHandicaps);
    this.updatePreferences();
  }

  isChecked(handicap: Handicap): boolean {
    return this.selectedHandicaps.some(h => h.id === handicap.id);
  }

  togglePreferences(): void {
    this.showPreferences = !this.showPreferences;
  }

  onPreferenceChange(preference: Preference, event: any): void {
    if (event.target.checked) {
      this.selectedPreferences.push(preference);
    } else {
      this.selectedPreferences = this.selectedPreferences.filter(p => p.id !== preference.id);
    }
    this.selectedPreferencesChange.emit(this.selectedPreferences);
  }

  isPreferenceChecked(preference: Preference): boolean {
    return this.selectedPreferences.some(p => p.id === preference.id);
  }

  updatePreferences(): void {
    // Pré-cocher certaines préférences selon les handicaps sélectionnés
    if (this.isChecked({ id: 2, name: 'En fauteuil roulant' })) {
      this.checkPreference(24); // Chemin extérieur accessible
      this.checkPreference(17); // Entrée accessible
      this.checkPreference(1);  // Chemin vers l'accueil accessible
    }
    if (this.isChecked({ id: 3, name: 'Difficulté à marcher' })) {
      this.checkPreference(22); // Chemin adapté aux personnes mal marchantes
      this.checkPreference(15); // Maximum une marche à l'entrée
      this.checkPreference(16); // Maximum une marche à l'accueil
    }
    if (this.isChecked({ id: 4, name: 'Difficulté à entendre' })) {
      this.checkPreference(5);  // Personnel sensibilisé ou formé
    }
    if (this.isChecked({ id: 5, name: 'Difficulté à comprendre' })) {
      this.checkPreference(5);  // Personnel sensibilisé ou formé
    }
  }

  checkPreference(preferenceId: number): void {
    const preference = this.preferences.find(p => p.id === preferenceId);
    if (preference && !this.isPreferenceChecked(preference)) {
      this.selectedPreferences.push(preference);
      this.selectedPreferencesChange.emit(this.selectedPreferences);
    }
  }
}
