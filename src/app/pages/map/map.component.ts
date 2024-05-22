import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

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

  @ViewChild('map', { static: false }) private mapContainer!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
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

    this.layerControl.addTo(this.map);
    this.layers['OpenStreetMap'].addTo(this.map);
  }
}
