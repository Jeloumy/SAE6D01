import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SystemPreferences } from '../models/user-profile'; // Correction de l'importation

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss']
})
export class SystemPreferencesComponent {
  private _preferences: SystemPreferences = {};

  @Input()
  get preferences(): SystemPreferences {
    return this._preferences;
  }

  set preferences(value: SystemPreferences) {
    this._preferences = value || {};
    this.preferencesChange.emit(this._preferences);
  }

  @Output() preferencesChange = new EventEmitter<SystemPreferences>();

  updatePreferences(key: string, value: any): void {
    this._preferences[key] = value;
    this.preferencesChange.emit(this._preferences);
  }

  onCheckboxChange(event: Event, key: string): void {
    const target = event.target as HTMLInputElement;
    this.updatePreferences(key, target.checked);
  }

  onRangeChange(event: Event, key: string): void {
    const target = event.target as HTMLInputElement;
    this.updatePreferences(key, target.valueAsNumber);
  }
}
