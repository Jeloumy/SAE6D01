import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { Subscription } from 'rxjs';
import { Handicap, UserProfile } from '../../models/definitions';

@Component({
  selector: 'app-handicap-form',
  templateUrl: './handicap-form.component.html',
  styleUrls: ['./handicap-form.component.scss']
})
export class HandicapFormComponent implements OnInit {
  dropdownOpen = false;
  types: { [key: string]: boolean } = {};
  private profileSubscription: Subscription | undefined;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.resetTypes(); // Réinitialiser les types d'handicap
    this.profileSubscription = this.profileService.currentProfile$.subscribe(profile => {
      this.updateFiltersFromProfile(profile);
    });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  applyTypes(): void {
    const selectedTypes = Object.entries(this.types)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    this.toggleDropdown();
  }

  private resetTypes(): void {
    this.types = {
      'Difficulté à entendre': false,
      'Difficulté à comprendre': false,
      'Difficulté à voir': false,
      'En fauteuil roulant': false,
      'Difficulté à marcher': false
    };
  }

  private updateFiltersFromProfile(profile: UserProfile | null): void {
    this.resetTypes(); // Réinitialiser les types d'handicap
    if (profile) {
      profile.handicapList.forEach(handicap => {
        this.types[handicap.handicap] = true;
      });
    }
  }
}
