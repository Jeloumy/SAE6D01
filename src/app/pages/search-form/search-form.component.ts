import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Handicap, DispositifLieu } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  searchQuery: string = '';
  selectedHandicaps: Handicap[] = [];
  selectedDispositifLieu: DispositifLieu[] = [];
  results: any;

  @Output() searchEvent = new EventEmitter<any>();

  private dispositifMapping: { [key: string]: string } = {
    'Chemin vers l\'accueil accessible': 'having_accessible_exterior_path',
    'Dispositif d\'appel à l\'entrée': 'having_entry_call_device',
    'Proximité de l\'accueil': 'having_visible_reception',
    'Présence de personnel': 'having_staff',
    'Personnel sensibilisé ou formé': 'having_trained_staff',
    'Audiodescription': 'having_audiodescription',
    'Equipements spécifiques pour personne malentendante': 'having_hearing_equipments',
    'Chemin sans rétrécissement jusqu\'à l\'accueil ou information inconnue': 'having_entry_no_shrink',
    'Chambre accessible': 'having_accessible_rooms',
    'Toilettes PMR': 'having_adapted_wc',
    'Établissement labellisé': 'having_label',
    'Stationnement à proximité': 'having_parking',
    'Transport en commun à proximité': 'having_public_transportation',
    'Stationnement PMR (dans l\'établissement ou à proximité)': 'having_adapted_parking',
    'Maximum une marche à l\'entrée': 'having_path_low_stairs',
    'Maximum une marche à l\'accueil': 'having_entry_low_stairs',
    'Entrée accessible': 'having_accessible_entry',
    'Largeur de porte supérieure à 80cm ou information inconnue': 'having_entry_min_width',
    'Entrée spécifique PMR': 'having_adapted_entry',
    'Balise sonore': 'having_sound_beacon',
    'Pas de chemin extérieur ou information inconnue': 'having_no_path',
    'Chemin adapté aux personnes mal marchantes': 'having_adapted_path',
    'Extérieur - plain-pied ou accessible via rampe ou ascenseur': 'having_reception_low_stairs',
    'Chemin extérieur accessible': 'having_accessible_path_to_reception',
    'Extérieur - bande de guidage': 'having_guide_band'
  };

  constructor(private profileService: ProfileService, private accesLibreService: AccesLibreService) {}

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
    const dispositifsFiltered = this.selectedDispositifLieu
      .map(d => this.dispositifMapping[d.name])
      .filter(d => d); // Filtre les valeurs vides
  
    const filters = {
      query: this.searchQuery,
      dispositifs: dispositifsFiltered
    };
  
    console.log('Filters:', filters);
  
    this.accesLibreService.getErp(filters).subscribe(data => {
      this.results = data;
      console.log('API Response:', data);
      this.searchEvent.emit(data); // Émettez les résultats
    });
  }
}
