import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Handicap, DispositifLieu } from '../../models/user-profile';
import { ProfileService } from '../../services/profile/profile.service';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';
import { GeolocationDialogComponent } from '../geolocation-dialog/geolocation-dialog.component';
import { MapComponent } from '../map/map.component';

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
  isLocationActive: boolean = false;

  @Output() searchEvent = new EventEmitter<any>();
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  private dispositifMapping: { [key: string]: string } = {
    // Mapping des dispositifs
  };

  constructor(
    private profileService: ProfileService,
    private accesLibreService: AccesLibreService,
    public dialog: MatDialog
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
}
