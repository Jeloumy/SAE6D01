import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Handicap } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-handicap-selector',
  templateUrl: './handicap-selector.component.html',
  styleUrls: ['./handicap-selector.component.scss']
})
export class HandicapSelectorComponent implements OnInit {
  @Input() selectedHandicaps: Handicap[] = [];
  @Output() selectedHandicapsChange = new EventEmitter<Handicap[]>();
  handicapTypes: Handicap[] = [];

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.handicapTypes = this.profileService.getHandicapTypes();
  }

  onHandicapChange(handicap: Handicap, event: any): void {
    if (event.target.checked) {
      this.selectedHandicaps.push(handicap);
    } else {
      this.selectedHandicaps = this.selectedHandicaps.filter(h => h.id !== handicap.id);
    }
    this.selectedHandicapsChange.emit(this.selectedHandicaps);
  }

  isChecked(handicap: Handicap): boolean {
    return this.selectedHandicaps.some(h => h.id === handicap.id);
  }
}
