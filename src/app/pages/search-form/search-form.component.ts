import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Handicap, DispositifLieu } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';
import { CommuneService } from '../../services/commune/commune.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GeolocationDialogComponent } from '../geolocation-dialog/geolocation-dialog.component';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  searchQuery: string = '';
  communeQuery: string = '';
  selectedHandicaps: Handicap[] = [];
  selectedDispositifLieu: DispositifLieu[] = [];
  results: any;
  isLocationActive: boolean = false;
  communes: { id: string; name: string }[] = [];
  private searchTerms = new Subject<string>();
  isCommuneInputFocused: boolean = false;

  @Output() searchEvent = new EventEmitter<any>();
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  private dispositifMapping: { [key: string]: string } = {
    "Chemin vers l'accueil accessible": 'having_accessible_exterior_path',
    "Dispositif d'appel à l'entrée": 'having_entry_call_device',
    "Proximité de l'accueil": 'having_visible_reception',
    'Présence de personnel': 'having_staff',
    'Personnel sensibilisé ou formé': 'having_trained_staff',
    Audiodescription: 'having_audiodescription',
    'Equipements spécifiques pour personne malentendante':
      'having_hearing_equipments',
    "Chemin sans rétrécissement jusqu'à l'accueil ou information inconnue":
      'having_entry_no_shrink',
    'Chambre accessible': 'having_accessible_rooms',
    'Toilettes PMR': 'having_adapted_wc',
    'Établissement labellisé': 'having_label',
    'Stationnement à proximité': 'having_parking',
    'Transport en commun à proximité': 'having_public_transportation',
    "Stationnement PMR (dans l'établissement ou à proximité)":
      'having_adapted_parking',
    "Maximum une marche à l'entrée": 'having_path_low_stairs',
    "Maximum une marche à l'accueil": 'having_entry_low_stairs',
    'Entrée accessible': 'having_accessible_entry',
    'Largeur de porte supérieure à 80cm ou information inconnue':
      'having_entry_min_width',
    'Entrée spécifique PMR': 'having_adapted_entry',
    'Balise sonore': 'having_sound_beacon',
    'Pas de chemin extérieur ou information inconnue': 'having_no_path',
    'Chemin adapté aux personnes mal marchantes': 'having_adapted_path',
    'Extérieur - plain-pied ou accessible via rampe ou ascenseur':
      'having_reception_low_stairs',
    'Chemin extérieur accessible': 'having_accessible_path_to_reception',
    'Extérieur - bande de guidage': 'having_guide_band',
  };

  constructor(
    private profileService: ProfileService,
    private accesLibreService: AccesLibreService,
    private communeService: CommuneService,
    public dialog: MatDialog
  ) {}


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
  }

  loadProfilePreferences(): void {
    const currentProfile = this.profileService.getCurrentProfile();
    console.log("current profile : ", currentProfile?.dispositifLieu);
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
      communeQuery: this.communeQuery,
      dispositifs: dispositifsFiltered,
    };

    console.log('Filters:', filters);

    this.accesLibreService.getErp(filters).subscribe(data => {
      this.results = data;
      console.log('API Response:', data);
      this.searchEvent.emit(data);
    });
  }

  toggleLocation(): void {
    if (!this.isLocationActive) {
      this.requestGeolocation();
    } else {
      this.isLocationActive = false;
      // Vous pouvez également réinitialiser les résultats de recherche ici si nécessaire
    }
  }

  requestGeolocation(): void {
    const dialogRef = this.dialog.open(GeolocationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUserLocation();
      } else {
        console.log('Géolocalisation refusée');
      }
    });
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const dispositifsFiltered = this.selectedDispositifLieu
          .map(d => this.dispositifMapping[d.name])
          .filter(d => d); // Filtre les valeurs vides

        const filters = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          dispositifs: dispositifsFiltered
        };

        console.log('Filters for search around me:', filters);

        this.accesLibreService.getErp(filters).subscribe(data => {
          this.results = data;
          console.log('API Response:', data);
          this.isLocationActive = true;
          this.searchEvent.emit(this.results); // Émettez les résultats

          const map = this.mapComponent.getMap();
          map.whenReady(() => {
            this.mapComponent.flyToLocation(position.coords.latitude, position.coords.longitude);
          });
        });
      }, error => {
        console.error('Geolocation error:', error);
        // Gérer les erreurs de géolocalisation
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Gérer le cas où la géolocalisation n'est pas supportée
    }
  }

  onCommuneQueryChange(event: any): void {
    const query = event.target.value;
    if (query.length > 3) {
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
}
