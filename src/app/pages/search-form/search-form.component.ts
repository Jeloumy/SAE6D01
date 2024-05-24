import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Handicap, DispositifLieu } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';
import { OpenCageService } from '../../services/open-cage/open-cage.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  searchQuery: string = '';
  selectedHandicaps: Handicap[] = [];
  selectedDispositifLieu: DispositifLieu[] = [];
  useGeolocation: boolean = false;
  radius: number = 15; 
  results: any;

  @Output() searchEvent = new EventEmitter<{ results: any, filters: any }>(); 

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

  constructor(
    private profileService: ProfileService,
    private accesLibreService: AccesLibreService,
    private openCageService: OpenCageService
  ) {}

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
    const filters = this.buildFilters();

    this.accesLibreService.getErp(filters).subscribe(data => {
      if (this.useGeolocation) {
        this.getGeolocation().then((position) => {
          const filteredResults = this.filterResultsByDistance(data.results, position.coords.latitude, position.coords.longitude, this.radius);
          data.results = filteredResults;
          this.results = data;
          this.searchEvent.emit({ results: data, filters: filters }); 
        }).catch((error) => {
          console.error('Error getting geolocation', error);
          this.results = data;
          this.searchEvent.emit({ results: data, filters: filters }); 
        });
      } else {
        this.openCageService.getGeolocation(this.searchQuery).subscribe(response => {
          const location = response.results[0].geometry;
          const filteredResults = this.filterResultsByDistance(data.results, location.lat, location.lng, this.radius);
          data.results = filteredResults;
          this.results = data;
          this.searchEvent.emit({ results: data, filters: filters }); 
        }, error => {
          console.error('Error getting geolocation from OpenCage', error);
          this.results = data;
          this.searchEvent.emit({ results: data, filters: filters }); 
        });
      }
    });
  }

  getGeolocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  buildFilters(): any {
    const dispositifsFiltered = this.selectedDispositifLieu
      .map(d => this.dispositifMapping[d.name])
      .filter(d => d); 

    const filters: any = {
      query: this.searchQuery,
      dispositifs: dispositifsFiltered,
      handicaps: this.selectedHandicaps.map(h => h.handicap)
    };

    return filters;
  }

  filterResultsByDistance(results: any[], userLat: number, userLon: number, maxDistance: number): any[] {
    return results.filter(result => {
      if (result.geom && result.geom.coordinates && result.geom.coordinates.length === 2) {
        const [lon, lat] = result.geom.coordinates;
        const distance = this.calculateDistance(userLat, userLon, lat, lon);
        return distance <= maxDistance;
      }
      return false;
    });
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
