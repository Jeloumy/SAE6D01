import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-extra-markers';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';

@Component({
  selector: 'app-map',
  template: '<div #map class="w-screen flex flex-1"></div>',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  private map!: L.Map;
  private layers: { [name: string]: L.TileLayer } = {
    'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }),
    'CartoDB Dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    })
    // Ajoutez d'autres couches de carte ici
  };
  private layerControl: L.Control.Layers = L.control.layers();
  private monuments: { name: string, coordinates: L.LatLngExpression }[] = [
    { name: 'Tour Eiffel', coordinates: [48.8584, 2.2945] },
    { name: 'Louvre Museum', coordinates: [48.8606, 2.3376] },
    // Ajoutez d'autres monuments ici
  ];

  @ViewChild('map', { static: false }) private mapContainer!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addMarkers();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    const coordinates: L.LatLngTuple = [48.8566, 2.3522]; // Coordonnées de Paris
    this.map = L.map(this.mapContainer.nativeElement).setView(coordinates, 13);

    for (const layerName in this.layers) {
      this.layerControl.addBaseLayer(this.layers[layerName], layerName);
    }

    // Vérifier si l'utilisateur a le mode sombre activé
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultLayer = prefersDark ? this.layers['CartoDB Dark'] : this.layers['OpenStreetMap'];

    this.layerControl.addTo(this.map);
    defaultLayer.addTo(this.map);
  }

  private addMarkers(): void {
    this.monuments.forEach(monument => {
      const customMarker = L.ExtraMarkers.icon({
        icon: 'fa-number',
        number: '1',
        markerColor: 'green',
        shape: 'square',
        prefix: 'fa'
      });
  
      L.marker(monument.coordinates, { icon: customMarker }).addTo(this.map).bindPopup(`<b>${monument.name}</b><br>Click to see more information`);
    });
  }
}
