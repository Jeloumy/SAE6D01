import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-extra-markers';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';

@Component({
  selector: 'app-map',
  template: '<div #map class="w-screen flex flex-1"></div>',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @ViewChild('map', { static: false })
  private mapContainer!: ElementRef<HTMLDivElement>;
  @Input() results: any;
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
    // Ajoutez d'autres couches de carte ici
  };

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
    const coordinates: L.LatLngTuple = [48.8566, 2.3522];
    this.map = L.map(this.mapContainer.nativeElement).setView(coordinates, 13);
    for (const layerName in this.layers) {
      this.layerControl.addBaseLayer(this.layers[layerName], layerName);
    }

    // Accède à l'attribut data-theme de la balise <html>
    const theme = document.documentElement.getAttribute('data-theme');
    const defaultLayer =
      theme === 'dark'
        ? this.layers['CartoDB Dark']
        : this.layers['OpenStreetMap'];

    // Sélectionne la balise contenant la carte Leaflet
    const leafletContainer = document.querySelector('.leaflet-container');
    leafletContainer?.classList.add('bg-base-700');

    this.layerControl.addTo(this.map);
    defaultLayer.addTo(this.map);

    // Initialize the LayerGroup to hold markers
    this.markersLayer = L.layerGroup().addTo(this.map);
  }

  private updateMarkers(): void {
    // Clear existing markers
    this.markersLayer.clearLayers();

    // Initialize LatLngBounds to hold all marker coordinates
    let newMarkers = new L.LatLngBounds([]);

    // Add new markers
    if (this.results && this.results.results) {
      this.results.results.forEach((result: any) => {
        const { geom, nom, adresse } = result;
        if (geom && geom.coordinates && geom.coordinates.length === 2) {
          const [longitude, latitude] = geom.coordinates;
          const customMarker = L.ExtraMarkers.icon({
            icon: 'fa-home',
            markerColor: 'blue',
            shape: 'square',
            prefix: 'fa',
          });

          const marker = L.marker([latitude, longitude], {
            icon: customMarker,
          }).bindPopup(`<b>${nom}</b><br>${adresse}`);

          // Add marker to the markers layer
          this.markersLayer.addLayer(marker);

          // Add marker coordinates to the LatLngBounds
          newMarkers.extend([latitude, longitude]);
        } else {
          console.error(`Invalid coordinates for result: ${nom}`, result);
        }
      });
    }

    // Fit map bounds to markers
    if (newMarkers.isValid()) {
      this.map.fitBounds(newMarkers);
    }
  }
}
