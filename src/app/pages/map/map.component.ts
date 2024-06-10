import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.map);

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
    if (this.results && this.results.results) {
      this.results.results.forEach((result: any) => {
        const { geom, nom, adresse } = result;
        if (geom && geom.coordinates && geom.coordinates.length === 2) {
          const [longitude, latitude] = geom.coordinates;
          const customMarker = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: '1',
            markerColor: 'green',
            shape: 'square',
            prefix: 'fa'
          });

          const marker = L.marker([latitude, longitude], { icon: customMarker })
            .bindPopup(`<b>${nom}</b><br>${adresse}`);

          this.markersLayer.addLayer(marker);
        } else {
          console.error(`Invalid coordinates for result: ${nom}`, result);
        }
      });
      this.map.addLayer(this.markersLayer);
    }
    this.page++;
  }
}
