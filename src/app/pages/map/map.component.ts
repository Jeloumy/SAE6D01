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
    switch (activity.toLowerCase()) {
      case 'musée':
        return '<i class="fas fa-landmark fa-2x" style="color: green;"></i>';
      case 'restaurant':
        return '<i class="fas fa-utensils fa-2x" style="color: blue;"></i>';
      case 'hôtel':
        return '<i class="fas fa-bed fa-2x" style="color: red;"></i>';
      case 'cinéma':
        return '<i class="fas fa-film fa-2x" style="color: purple;"></i>';
      case 'théâtre':
        return '<i class="fas fa-theater-masks fa-2x" style="color: orange;"></i>';
      case 'bibliothèque':
        return '<i class="fas fa-book fa-2x" style="color: brown;"></i>';
      case 'parc':
        return '<i class="fas fa-tree fa-2x" style="color: green;"></i>';
      case 'hôpital':
        return '<i class="fas fa-hospital fa-2x" style="color: pink;"></i>';
      case 'pharmacie':
        return '<i class="fas fa-prescription-bottle-alt fa-2x" style="color: green;"></i>';
      case 'école':
        return '<i class="fas fa-school fa-2x" style="color: yellow;"></i>';
      case 'magasin':
        return '<i class="fas fa-store fa-2x" style="color: black;"></i>';
      case 'bar':
        return '<i class="fas fa-beer fa-2x" style="color: brown;"></i>';
      case 'boulangerie':
        return '<i class="fas fa-bread-slice fa-2x" style="color: wheat;"></i>';
      // Ajoutez plus de cas pour d'autres types d'activités
      default:
        return '<i class="fas fa-map-marker-alt fa-2x" style="color: black;"></i>';
    }
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
