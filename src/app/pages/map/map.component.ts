import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  template: '<div #map style="height: 400px;"></div>',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  private map!: L.Map;
  @ViewChild('map', { static: false }) private mapContainer!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    // ngOnInit is not the right place to initialize the map since the view might not be ready yet.
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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }
}
