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
import 'leaflet.markercluster';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';

@Component({
  selector: 'app-map',

  template: '<div #map class="w-screen h-screen"></div>',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('map', { static: false }) private mapContainer!: ElementRef<HTMLDivElement>;
  @Input() results: any = { results: [] };
  @Input() filters: any;
  private map!: L.Map;
  private markersLayer = L.markerClusterGroup();
  private currentBounds!: L.LatLngBounds;
  private page: number = 1;
  private pageSize: number = 50;
  private cache: { [key: string]: any } = {};
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

  constructor(private accesLibreService: AccesLibreService) {}


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

    if (changes['filters'] && this.filters) {
      this.page = 1;
      this.fetchPagedResults();
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

    // Applique la classe CSS appropriée en fonction du thème
    if (theme === 'dark') {
      leafletContainer?.classList.add('bg-slate-700');
    } else {
      leafletContainer?.classList.add('bg-slate-100');
    }

    this.layerControl.addTo(this.map);
    defaultLayer.addTo(this.map);

    this.map.addLayer(this.markersLayer);

    this.map.on('moveend', () => {
      const newBounds = this.map.getBounds();
      if (!this.currentBounds || !this.currentBounds.equals(newBounds)) {
        this.currentBounds = newBounds;
        this.page = 1;
        this.fetchPagedResults();
      }
    });
  }

  private fetchPagedResults(): void {
    const bounds = this.currentBounds;
    const key = `${bounds.toBBoxString()}-${this.page}-${this.pageSize}`;

    if (this.cache[key]) {
      this.results = this.cache[key];
      this.updateMarkers();
    } else {
      const filters = this.buildFilters(bounds, this.page, this.pageSize, this.filters);
      this.accesLibreService.getErp(filters).subscribe(data => {
        if (this.page === 1) {
          this.results = data;
        } else {
          this.results.results.push(...data.results);
        }
        this.cache[key] = this.results;
        this.updateMarkers();
      }, error => {
        if (error.status === 429) {
          console.error("Too many requests. Please try again later.");
        } else {
          console.error("Error fetching data:", error);
        }
      });
    }
  }

  private buildFilters(bounds: L.LatLngBounds, page: number, pageSize: number, filters: any): any {
    const params: any = {
      northEast: bounds.getNorthEast(),
      southWest: bounds.getSouthWest(),
      page: page,
      pageSize: pageSize,
      query: filters.query || ''
    };

    if (filters.dispositifs) {
      params.dispositifs = filters.dispositifs;
    }

    if (filters.handicaps) {
      params.handicaps = filters.handicaps;
    }

    return params;
  }

  private updateMarkers(): void {
    this.markersLayer.clearLayers();


    // Initialize LatLngBounds to hold all marker coordinates
    let newMarkers = new L.LatLngBounds([]);


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

          this.markersLayer.addLayer(marker);

          // Add marker coordinates to the LatLngBounds
          newMarkers.extend([latitude, longitude]);
        } else {
          console.error(`Invalid coordinates for result: ${nom}`, result);
        }
      });
      this.map.addLayer(this.markersLayer);
    }

    this.page++;

    // Fit map bounds to markers
    if (newMarkers.isValid()) {
      console.log('test')
      this.map.fitBounds(newMarkers);
    }

  }
}
