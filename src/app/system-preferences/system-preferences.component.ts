import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SystemPreferences } from '../models/user-profile';

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss']
})
export class SystemPreferencesComponent {
  @Input() preferences: SystemPreferences = {} as SystemPreferences;
  @Output() preferencesChange = new EventEmitter<SystemPreferences>();

  updatePreferences(key: string, value: any): void {
    const newPreferences = { ...this.preferences, [key]: value };
    this.preferences = newPreferences;
    this.preferencesChange.emit(newPreferences);
  }

  onCheckboxChange(event: any, key: string): void {
    this.updatePreferences(key, event.target.checked);
  }

  onRangeChange(event: any, key: string): void {
    this.updatePreferences(key, event.target.value);
  }
}
