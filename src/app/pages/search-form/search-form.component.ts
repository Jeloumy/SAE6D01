import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Handicap, DispositifLieu } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';
import { CommuneService } from '../../services/commune/commune.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MapComponent } from '../map/map.component';
import { GeolocationButtonComponent } from '../geolocation-button/geolocation-button.component';

const SEARCH_RADIUS_KM = 10;

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  searchQuery: string = '';
  communeQuery: string = '';
  displayCommuneQuery: string = '';
  selectedHandicaps: Handicap[] = [];
  selectedDispositifLieu: DispositifLieu[] = [];
  results: any;
  isLocationActive: boolean = false;
  communes: { id: string; name: string }[] = [];
  private searchTerms = new Subject<string>();
  isCommuneInputFocused: boolean = false;
  initialCommuneQuery: string = '';
  showFilters: boolean = false;

  @Output() searchEvent = new EventEmitter<any>();
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  @ViewChild(GeolocationButtonComponent) geolocationButton!: GeolocationButtonComponent;

  private dispositifMapping: { [key: string]: string } = {
    "Chemin vers l'accueil accessible": 'having_accessible_exterior_path',
    "Dispositif d'appel à l'entrée": 'having_entry_call_device',
    "Proximité de l'accueil": 'having_visible_reception',
    'Présence de personnel': 'having_staff',
    'Personnel sensibilisé ou formé': 'having_trained_staff',
    Audiodescription: 'having_audiodescription',
    'Equipements spécifiques pour personne malentendante': 'having_hearing_equipments',
    "Chemin sans rétrécissement jusqu'à l'accueil ou information inconnue": 'having_entry_no_shrink',
    'Chambre accessible': 'having_accessible_rooms',
    'Toilettes PMR': 'having_adapted_wc',
    'Établissement labellisé': 'having_label',
    'Stationnement à proximité': 'having_parking',
    'Transport en commun à proximité': 'having_public_transportation',
    "Stationnement PMR (dans l'établissement ou à proximité)": 'having_adapted_parking',
    "Maximum une marche à l'entrée": 'having_path_low_stairs',
    "Maximum une marche à l'accueil": 'having_entry_low_stairs',
    'Entrée accessible': 'having_accessible_entry',
    'Largeur de porte supérieure à 80cm ou information inconnue': 'having_entry_min_width',
    'Entrée spécifique PMR': 'having_adapted_entry',
    'Balise sonore': 'having_sound_beacon',
    'Pas de chemin extérieur ou information inconnue': 'having_no_path',
    'Chemin adapté aux personnes mal marchantes': 'having_adapted_path',
    'Extérieur - plain-pied ou accessible via rampe ou ascenseur': 'having_reception_low_stairs',
    'Chemin extérieur accessible': 'having_accessible_path_to_reception',
    'Extérieur - bande de guidage': 'having_guide_band',
  };

  constructor(
    private profileService: ProfileService,
    private accesLibreService: AccesLibreService,
    private communeService: CommuneService
  ) {}

  moreFilters(): void {
    this.showFilters = !this.showFilters;
  }

  ngOnInit(): void {
    this.loadProfilePreferences();
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => this.communeService.fetchCommunes(query))
      )
      .subscribe(
        (communes: { id: string; name: string }[]) => {
          this.communes = communes;
          console.log(this.communes);
        },
        (error: any) => {
          console.error('Error fetching communes:', error);
        }
      );

    // Écouter les mises à jour de la géolocalisation
    this.profileService.getGeolocationUpdates().subscribe((geolocationData) => {
      if (geolocationData.latitude !== null && geolocationData.longitude !== null) {
        this.isLocationActive = true;
        this.onLocationDetected(geolocationData as { latitude: number, longitude: number });  // Cast to ensure non-null
        this.setCommuneNameFromGeolocation(geolocationData.latitude, geolocationData.longitude);
      }
    });

    // Écouter les changements d'état de la géolocalisation
    this.profileService.getIsLocationActive().subscribe((isActive) => {
      this.isLocationActive = isActive;
      if (this.isLocationActive) {
        this.displayCommuneQuery = `${SEARCH_RADIUS_KM} km autour de ma position`;
      }
    });
  }

  loadProfilePreferences(): void {
    const currentProfile = this.profileService.getCurrentProfile();
    if (currentProfile) {
      this.selectedHandicaps = currentProfile.handicapList;
      this.selectedDispositifLieu = currentProfile.dispositifLieu;
    }
  }

  onSelectedHandicapsChange(handicaps: Handicap[]): void {
    this.selectedHandicaps = handicaps;
  }

  onSelectedDispositifLieuChange(dispositifs: DispositifLieu[]): void {
    this.selectedDispositifLieu = dispositifs;
  }

  onSearch(): void {
    if (this.communeQuery !== this.initialCommuneQuery) {
      this.isLocationActive = false;
      this.profileService.setIsLocationActive(false);
    }

    const dispositifsFiltered = this.selectedDispositifLieu
      .map(d => this.dispositifMapping[d.name])
      .filter(d => d); // Filtre les valeurs vides

    const filters: any = {
      query: this.searchQuery,
      dispositifs: dispositifsFiltered,
    };

    if (!this.isLocationActive) {
      filters.communeQuery = this.communeQuery;
    }

    console.log('isLocationActive in onSearch:', this.isLocationActive); // Ajout de console.log
    if (this.isLocationActive) {
      const geolocationData = this.profileService.getGeolocationData();
      if (geolocationData && geolocationData.latitude !== null && geolocationData.longitude !== null) {
        filters.latitude = geolocationData.latitude;
        filters.longitude = geolocationData.longitude;
        filters.radius = SEARCH_RADIUS_KM;
      }
    }

    console.log('Filters before removing inactive:', filters); // Ajout de console.log

    // Si les dispositifs ou la géolocalisation sont désactivés, on les retire des filtres
    if (dispositifsFiltered.length === 0) {
      delete filters.dispositifs;
    }

    if (!this.isLocationActive) {
      delete filters.latitude;
      delete filters.longitude;
      delete filters.radius;
    }

    console.log('Filters:', filters); // Ajout de console.log

    this.accesLibreService.getErp(filters).subscribe(data => {
      this.results = data;
      console.log('API Response:', data);
      this.searchEvent.emit(data);
      
      // Mettre à jour les marqueurs sur la carte après la recherche
      this.mapComponent.updateMarkers();
    });

    // Mettre à jour initialCommuneQuery après la recherche
    this.initialCommuneQuery = this.communeQuery;
  }

  onLocationDetected(geolocationData: { latitude: number; longitude: number }): void {
    console.log('Location detected event received'); // Ajout de console.log
    this.isLocationActive = true;
    this.profileService.setIsLocationActive(this.isLocationActive);
    this.onSearch(); // Effectuez une nouvelle recherche avec les nouveaux filtres
  }

  onLocationToggled(isLocationActive: boolean): void {
    console.log('Location toggled:', isLocationActive); // Ajout de console.log
    this.isLocationActive = isLocationActive;
    this.profileService.setIsLocationActive(this.isLocationActive);
    if (isLocationActive) {
      this.getUserLocation();
    } else {
      this.profileService.setGeolocationData(null, null);
      this.onSearch(); // Effectuez une recherche sans géolocalisation
    }
  }

  async getUserLocation(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.profileService.setGeolocationData(position.coords.latitude, position.coords.longitude);
      console.log('User location detected:', position.coords); // Ajout de console.log
      this.onLocationDetected(position.coords);
      await this.setCommuneNameFromGeolocation(position.coords.latitude, position.coords.longitude); // Ajout d'attente
      this.displayCommuneQuery = `${SEARCH_RADIUS_KM} km autour de ma position (${this.communeQuery})`; // Mettre à jour displayCommuneQuery
    } catch (error) {
      console.error('Geolocation error:', error);
    }
  }

  async setCommuneNameFromGeolocation(lat: number, lon: number): Promise<void> {
    const geonamesApiUrl = `https://secure.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lon}&username=demo`;
    try {
      const response = await fetch(geonamesApiUrl);
      const data = await response.json();
      if (data.geonames && data.geonames.length > 0) {
        const communeName = data.geonames[0].name;
        this.communeQuery = communeName;
        this.displayCommuneQuery = `${SEARCH_RADIUS_KM} km autour de ma position (${communeName})`;
        this.initialCommuneQuery = this.communeQuery; // Mettre à jour initialCommuneQuery après géolocalisation
      }
    } catch (error) {
      console.error('Error fetching commune name:', error);
    }
  }

  onCommuneQueryChange(event: any): void {
    const query = event.target.value;
    this.communeQuery = query; // Mettre à jour communeQuery avec la saisie de l'utilisateur
    this.displayCommuneQuery = query; // Mettre à jour displayCommuneQuery
    if (query.length >= 3) {
      this.searchTerms.next(query);
    } else {
      this.communes = [];
    }
  }

  onCommuneInputFocus(): void {
    this.isCommuneInputFocused = true;
  }

  selectCommune(commune: { id: string; name: string }): void {
    this.communeQuery = commune.name;
    this.displayCommuneQuery = commune.name; // Mettre à jour displayCommuneQuery lors de la sélection
    this.communes = [];
    this.isCommuneInputFocused = false;
  }

  fetchCommunes(query: string): void {
    this.communeService.fetchCommunes(query).subscribe(
      (communes: { id: string; name: string }[]) => {
        this.communes = communes;
        console.log(this.communes);
      },
      (error: any) => {
        console.error('Error fetching communes:', error);
      }
    );
  }

  handleCommuneDetected(communeName: string): void {
    this.communeQuery = communeName;
    this.displayCommuneQuery = `${SEARCH_RADIUS_KM} km autour de ma position (${communeName})`;
  }
}
