import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Handicap, DispositifLieu } from '../../models/definitions';
import { ProfileService } from '../../services/profile/profile.service';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';
import { CommuneService } from '../../services/commune/commune.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GeolocationDialogComponent } from '../geolocation-dialog/geolocation-dialog.component';
import { MapComponent } from '../map/map.component';
import { dispositifMapping } from '../../models/dispositifs-mapping';

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
    if (currentProfile) {
      this.selectedHandicaps = currentProfile.handicapList;
      this.selectedDispositifLieu = currentProfile.dispositifLieu;
    }
  }

  onSearch(): void {
    const dispositifsFiltered = this.selectedDispositifLieu
      .map(d => dispositifMapping[d.name]) // Utilisez dispositifMapping au lieu de this.dispositifMapping
      .filter(d => d); // Filtre les valeurs vides
  
    const filters = {
      query: this.searchQuery,
      communeQuery: this.communeQuery,
      dispositifs: dispositifsFiltered,
    };
  
    console.log('Filters:', filters);
  
    this.accesLibreService.getErp(filters).subscribe(data => {
      this.results = data;
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
          .map(d => dispositifMapping[d.name]) // Utilisez dispositifMapping au lieu de this.dispositifMapping
          .filter(d => d);
  
        const filters = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          dispositifs: dispositifsFiltered
        };
  
        console.log('Filters for search around me:', filters);
  
        this.accesLibreService.getErp(filters).subscribe(data => {
          this.results = data;
          this.isLocationActive = true;
          this.searchEvent.emit(this.results);
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
