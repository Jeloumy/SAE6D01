import { Component } from '@angular/core';

@Component({
  selector: 'app-handicap-form',
  templateUrl: './handicap-form.component.html',
  styleUrl: './handicap-form.component.scss'
})
export class HandicapFormComponent {
  dropdownOpen = false;
  types: {[key: string]: boolean} = {};
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  applyTypes(): void {
    const selectedTypes = Object.entries(this.types)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    this.toggleDropdown();
  }
}
