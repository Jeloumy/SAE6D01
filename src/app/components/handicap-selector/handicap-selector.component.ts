import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Handicap, DispositifLieu, UserProfile } from '../../models/definitions';
import { ProfileService } from '../../services/profile/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-handicap-selector',
  templateUrl: './handicap-selector.component.html',
  styleUrls: ['./handicap-selector.component.scss']
})
export class HandicapSelectorComponent implements OnInit {
  @Input() selectedHandicaps: Handicap[] = [];
  @Input() selectedDispositifLieu: DispositifLieu[] = [];
  @Output() selectedHandicapsChange = new EventEmitter<Handicap[]>();
  @Output() selectedDispositifLieuChange = new EventEmitter<DispositifLieu[]>();
  handicapTypes: Handicap[] = [];
  dispositifLieu: DispositifLieu[] = [];
  showDispositifLieu: boolean = false;
  autoSelectedDispositifLieu: DispositifLieu[] = [];
  manuallySelectedDispositifLieu: DispositifLieu[] = [];

  private profileSubscription: Subscription | undefined;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.handicapTypes = this.profileService.getHandicapTypes();
    this.dispositifLieu = this.profileService.getDispositifLieu();
    this.profileSubscription = this.profileService.currentProfile$.subscribe(profile => {
      this.loadCurrentProfileData(profile);
    });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  loadCurrentProfileData(profile: UserProfile | null): void {
    if (profile) {
      this.selectedHandicaps = profile.handicapList;
      this.selectedDispositifLieu = profile.dispositifLieu;
      this.autoSelectedDispositifLieu = []; // Reset auto-selected list
      this.manuallySelectedDispositifLieu = profile.dispositifLieu.filter(d => !this.isAutoSelected(d.id));
    }
  }

  onHandicapChange(handicap: Handicap, event: any): void {
    if (event.target.checked) {
      this.selectedHandicaps.push(handicap);
      this.updateDispositifLieu();
    } else {
      this.selectedHandicaps = this.selectedHandicaps.filter(h => h.id !== handicap.id);
      this.removeDispositifLieuByHandicap(handicap.id);
    }
    this.selectedHandicapsChange.emit(this.selectedHandicaps);
  }

  isChecked(handicap: Handicap): boolean {
    return this.selectedHandicaps.some(h => h.id === handicap.id);
  }

  toggleDispositifLieu(event: Event): void {
    event.preventDefault();
    this.showDispositifLieu = !this.showDispositifLieu;
  }

  onDispositifLieuChange(dispositiflieu: DispositifLieu, event: any): void {
    if (event.target.checked) {
      this.selectedDispositifLieu.push(dispositiflieu);
      this.manuallySelectedDispositifLieu.push(dispositiflieu);
    } else {
      this.selectedDispositifLieu = this.selectedDispositifLieu.filter(p => p.id !== dispositiflieu.id);
      this.manuallySelectedDispositifLieu = this.manuallySelectedDispositifLieu.filter(p => p.id !== dispositiflieu.id);
    }
    this.selectedDispositifLieuChange.emit(this.selectedDispositifLieu);
  }

  isDispositifLieuChecked(dispositiflieu: DispositifLieu): boolean {
    return this.selectedDispositifLieu.some(d => d.id === dispositiflieu.id);
  }

  updateDispositifLieu(): void {
    this.autoSelectedDispositifLieu = []; // Clear auto-selected preferences before updating
    if (this.isChecked({ id: 2, handicap: 'En fauteuil roulant' })) {
      this.checkDispositifLieu(24); // Chemin extérieur accessible
      this.checkDispositifLieu(17); // Entrée accessible
      this.checkDispositifLieu(1);  // Chemin vers l'accueil accessible
    }
    if (this.isChecked({ id: 3, handicap: 'Difficulté à marcher' })) {
      this.checkDispositifLieu(22); // Chemin adapté aux personnes mal marchantes
      this.checkDispositifLieu(15); // Maximum une marche à l'entrée
      this.checkDispositifLieu(16); // Maximum une marche à l'accueil
    }
    if (this.isChecked({ id: 4, handicap: 'Difficulté à entendre' })) {
      this.checkDispositifLieu(5);  // Personnel sensibilisé ou formé
    }
    if (this.isChecked({ id: 5, handicap: 'Difficulté à comprendre' })) {
      this.checkDispositifLieu(5);  // Personnel sensibilisé ou formé
    }
  }

  checkDispositifLieu(dispositiflieuId: number): void {
    const dispositiflieu = this.dispositifLieu.find(p => p.id === dispositiflieuId);
    if (dispositiflieu && !this.isDispositifLieuChecked(dispositiflieu)) {
      this.selectedDispositifLieu.push(dispositiflieu);
      this.autoSelectedDispositifLieu.push(dispositiflieu);
      this.selectedDispositifLieuChange.emit(this.selectedDispositifLieu);
    }
  }

  removeDispositifLieuByHandicap(handicapId: number): void {
    let toRemove: number[] = [];
    if (handicapId === 2) { // En fauteuil roulant
      toRemove = [24, 17, 1];
    } else if (handicapId === 3) { // Difficulté à marcher
      toRemove = [22, 15, 16];
    } else if (handicapId === 4 || handicapId === 5) { // Difficulté à entendre or Difficulté à comprendre
      toRemove = [5];
    }

    this.autoSelectedDispositifLieu = this.autoSelectedDispositifLieu.filter(d => !toRemove.includes(d.id));
    this.selectedDispositifLieu = this.selectedDispositifLieu.filter(p => !toRemove.includes(p.id) || this.manuallySelectedDispositifLieu.includes(p));
    this.selectedDispositifLieuChange.emit(this.selectedDispositifLieu);
  }

  private isAutoSelected(dispositiflieuId: number): boolean {
    return this.autoSelectedDispositifLieu.some(d => d.id === dispositiflieuId);
  }

  reset(): void {
    this.selectedHandicaps = [];
    this.selectedDispositifLieu = [];
    this.autoSelectedDispositifLieu = [];
    this.manuallySelectedDispositifLieu = [];
    this.selectedHandicapsChange.emit(this.selectedHandicaps);
    this.selectedDispositifLieuChange.emit(this.selectedDispositifLieu);
  }
}
