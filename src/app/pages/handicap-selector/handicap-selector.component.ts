import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Handicap, DispositifLieu } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-handicap-selector',
  templateUrl: './handicap-selector.component.html',
  styleUrls: ['./handicap-selector.component.scss']
})
export class HandicapSelectorComponent implements OnInit {
  @Input() selectedHandicaps: Handicap[] = [];
  @Output() selectedHandicapsChange = new EventEmitter<Handicap[]>();
  @Output() selectedDispositifLieuChange = new EventEmitter<DispositifLieu[]>();
  handicapTypes: Handicap[] = [];
  dispositifLieu: DispositifLieu[] = [];
  showDispositifLieu: boolean = false;
  selectedDispositifLieu: DispositifLieu[] = [];

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.handicapTypes = this.profileService.getHandicapTypes();
    this.dispositifLieu = this.profileService.getDispositifLieu();
  }

  onHandicapChange(handicap: Handicap, event: any): void {
    if (event.target.checked) {
      this.selectedHandicaps.push(handicap);
    } else {
      this.selectedHandicaps = this.selectedHandicaps.filter(h => h.id !== handicap.id);
    }
    this.selectedHandicapsChange.emit(this.selectedHandicaps);
    this.updateDispositifLieu();
  }

  isChecked(handicap: Handicap): boolean {
    return this.selectedHandicaps.some(h => h.id === handicap.id);
  }

  toggleDispositifLieu(): void {
    this.showDispositifLieu = !this.showDispositifLieu;
  }

  onDispositifLieuChange(dispositiflieu: DispositifLieu, event: any): void {
    if (event.target.checked) {
      this.selectedDispositifLieu.push(dispositiflieu);
    } else {
      this.selectedDispositifLieu = this.selectedDispositifLieu.filter(p => p.id !== dispositiflieu.id);
    }
    this.selectedDispositifLieuChange.emit(this.selectedDispositifLieu);
  }

  isDispositifLieuChecked(dispositiflieu: DispositifLieu): boolean {
    return this.selectedDispositifLieu.some(p => p.id === dispositiflieu.id);
  }

  updateDispositifLieu(): void {
    // Pré-cocher certaines préférences selon les handicaps sélectionnés
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
      this.selectedDispositifLieuChange.emit(this.selectedDispositifLieu);
    }
  }
}
