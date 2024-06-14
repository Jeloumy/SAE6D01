import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { ProfileService } from '../../services/profile/profile.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('map', { static: false })
  private mapContainer!: ElementRef<HTMLDivElement>;
  @Input() results: any;
  @Output() locationDetected = new EventEmitter<void>();

  private map!: L.Map;
  private markersLayer!: L.LayerGroup;
  private layerControl: L.Control.Layers = L.control.layers();
  private layers: { [name: string]: L.TileLayer } = {
    OpenStreetMap: L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
      }
    ),
    'CartoDB Dark': L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
      }
    ),
  };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results'] && this.results) {
      this.updateMarkers();
    }
  }

  private initMap(): void {
    const franceCenter: L.LatLngExpression = [46.603354, 1.888334];
    const franceBounds: L.LatLngBoundsLiteral = [
      [41.33, -5.14],
      [51.124, 9.662],
    ];

    this.map = L.map(this.mapContainer.nativeElement, {
      maxBounds: franceBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 5,
    }).setView(franceCenter, 5);

    for (const layerName in this.layers) {
      this.layerControl.addBaseLayer(this.layers[layerName], layerName);
    }

    const theme = document.documentElement.getAttribute('data-theme');
    const defaultLayer =
      theme === 'dark'
        ? this.layers['CartoDB Dark']
        : this.layers['OpenStreetMap'];

    const leafletContainer = document.querySelector('.leaflet-container');
    leafletContainer?.classList.add('bg-base-100');

    this.layerControl.addTo(this.map);
    defaultLayer.addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
  }

  public updateMarkers(): void {
    this.markersLayer.clearLayers();

    let newMarkers = new L.LatLngBounds([]);

    if (this.results && this.results.results) {
      this.results.results.forEach((result: any) => {
        const { geom, nom, adresse, activite } = result;
        if (geom && geom.coordinates && geom.coordinates.length === 2) {
          const [longitude, latitude] = geom.coordinates;

          // Sélectionner l'icône appropriée
          const iconHtml = this.getIconHtml(activite.nom);
          const icon = L.divIcon({
            html: iconHtml,
            className: 'custom-div-icon',
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -35],
          });

          const marker = L.marker([latitude, longitude], { icon }).bindPopup(
            `<b>${nom}</b><br>${adresse}`
          );

          this.markersLayer.addLayer(marker);

          newMarkers.extend([latitude, longitude]);
        } else {
          console.error(`Invalid coordinates for result: ${nom}`, result);
        }
      });
    }

    if (newMarkers.isValid()) {
      this.map.flyToBounds(newMarkers, {
        animate: true,
        duration: 2,
        easeLinearity: 0.25,
      });
    }
  }

  private getIconHtml(activity: string): string {

    const icons : { [key: string]: string }= {
      'musée' : 'fa-landmark',
      'restaurant' : 'fa-utensils',
      'hôtel' : 'fa-solid fa-hotel',
      'cinéma' : 'fa-film',
      'théâtre' : 'fa-theater-masks',
      'bibliothèque': 'fa-book',
      'parc' : 'fa-tree',
      'hôpital' : 'fa-hospital',
      'pharmacie' : 'fa-prescription-bottle-alt',
      'école' : 'fa-school',
      'collège' : 'fa-school',
      'lycée' : 'fa-school',
      'magasin' : 'fa-store',
      'bar' : 'fa-beer',
      'boulangerie' : 'fa-bread-slice',
      'café' : 'fa-mug-saucer',
      'supermarché' : 'fa-basket-shopping',
      'sport' : 'fa-dumbbell',
      'vetement' : 'fa-shirt',
      'photo' : 'fa-camera',
      'beauté' : 'fa-spa',
      'jeu vidéo' : "fa-gamepad",
      'chocolatier' : "fa-candy-cane",
      'confisier' : "fa-candy-cane",
      'bijou' : "fa-gem",
      'restauration rapide' : 'fa-burger',
      'opticien' : 'fa-glasses',
      'Auto école' : 'fa-car-side',
      'art' : 'fa-palette',
      'coiffeur' : 'fa-scissors',
    };

    let found = false;

    for (const pattern in icons) {
      const regex = new RegExp(pattern); // Convertir la chaîne de caractères en regex
      if (regex.test(activity.toLowerCase())) {
        found = true;
        return '<span class="fa-stack fa-xl"> <i class="fa-solid fa-location-pin fa-stack-2x" style="color: #134e4a;"></i> <i class="fa-solid ' + icons[pattern] +  ' fa-stack-1x fa-inverse" style="line-height: 1; margin: 10% 10% 0 0; font-size: 85%"></i> </span>';
      }
    }
      return '<i class="fa-solid fa-location-dot fa-stack-2x" style="color: #134e4a;">';
  }

  flyToLocation(lat: number, lon: number): void {
    const zoomLevel = 13;
    const options: L.ZoomPanOptions = {
      animate: true,
      duration: 5,
      easeLinearity: 0.25,
    };
    this.map.flyTo([lat, lon], zoomLevel, options);
  }

  public getMap(): L.Map {
    return this.map;
  }

  onLocationToggled(isLocationActive: boolean): void {
    console.log('Location toggled:', isLocationActive);
    if (isLocationActive) {
      this.getUserLocation();
    }
  }

  async getUserLocation(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition();
      console.log('User location detected:', position.coords);
      this.flyToLocation(position.coords.latitude, position.coords.longitude);
      this.locationDetected.emit();
    } catch (error) {
      console.error('Geolocation error:', error);
    }
  }
}
