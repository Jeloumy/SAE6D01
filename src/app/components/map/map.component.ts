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
import { MarkerService } from '../../services/marker/marker.service';
import { ERP } from '../../models/definitions';

interface Layer {
  [name: string]: L.TileLayer;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @ViewChild('map', { static: false })
  private mapContainer!: ElementRef<HTMLDivElement>;
  @Input() results:
    | {
        count?: number;
        next?: string | null;
        page_size?: number;
        previous?: string | null;
        results: ERP[];
      }
    | undefined;
  private map!: L.Map;
  private layerControl: L.Control.Layers = L.control.layers();
  private layers: Layer = {
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

  constructor(private markerService: MarkerService) {}

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
      this.markerService.updateMarkers(this.results);
    }
  }

  private initMap(): void {
    const franceCenter: L.LatLngExpression = [46.603354, 1.888334];
    const franceBounds: L.LatLngBoundsLiteral = [
      [41.33, -5.14], // Sud-Ouest (point bas)
      [51.124, 9.662], // Nord-Est (point haut)
    ];

    this.map = L.map(this.mapContainer.nativeElement, {
      maxBounds: franceBounds,
      maxBoundsViscosity: .5,
      minZoom: 4,
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
    if (
      leafletContainer &&
      !leafletContainer.classList.contains('bg-base-100')
    ) {
      leafletContainer.classList.add('bg-base-100');
    }

    this.layerControl.addTo(this.map);
    defaultLayer.addTo(this.map);

    this.markerService.initMarkersLayer(this.map);
  }

  flyToLocation(lat: number, lon: number): void {
    const zoomLevel = 13;
    const options: L.ZoomPanOptions = {
      animate: true,
      duration: 5, // Durée de l'animation en secondes
      easeLinearity: 0.25, // Modifie la linéarité de l'animation
    };
    this.map.flyTo([lat, lon], zoomLevel, options);
  }

  public getMap(): L.Map {
    return this.map;
  }
}
