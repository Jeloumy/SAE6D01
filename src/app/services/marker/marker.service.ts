import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-extra-markers';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  private markersLayer!: L.LayerGroup;

  constructor() {}

  public initMarkersLayer(map: L.Map): void {
    this.markersLayer = L.layerGroup().addTo(map);
  }

  public updateMarkers(results: any): void {
    // Clear existing markers
    if (this.markersLayer) {
      this.markersLayer.clearLayers();
    }

    // Initialize LatLngBounds to hold all marker coordinates
    let newMarkers = new L.LatLngBounds([]);

    // Add new markers
    if (results && results.results) {
      results.results.forEach((result: any) => {
        const { geom, nom, adresse, slug } = result;
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
          }).bindPopup(`
            <div class="gap flex flex-col">
              <h2 class="text-lg font-bold">${nom}</h2>
              <span class="text-md text-base-content">${adresse}</span>
              <div class="mt-2 card-actions">
                <a href="/erp/${slug}" class="font-bold btn btn-primary">Voir l'établissement</a>
              </div>
            </div>
          `);

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
    // if (newMarkers.isValid() && this.markersLayer.getLayers().length > 0) {
    //   this.markersLayer.addTo(map);
    //   map.fitBounds(newMarkers);
    // }
  }
}
