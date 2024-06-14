import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-geolocation-button',
  templateUrl: './geolocation-button.component.html',
  styleUrls: ['./geolocation-button.component.scss']
})
export class GeolocationButtonComponent implements OnInit {
  @Output() locationDetected = new EventEmitter<{ latitude: number, longitude: number }>();
  @Output() locationToggled = new EventEmitter<boolean>();
  @Output() communeDetected = new EventEmitter<string>();
  isLocationActive: boolean = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getIsLocationActive().subscribe((isActive) => {
      this.isLocationActive = isActive;
    });
  }

  toggleLocation(): void {
    if (!this.isLocationActive) {
      this.getUserLocation();
    } else {
      this.isLocationActive = false;
      this.profileService.setIsLocationActive(this.isLocationActive);
      this.profileService.setGeolocationData(null, null); // Réinitialiser les données de géolocalisation
      this.locationToggled.emit(this.isLocationActive);
    }
  }

  async getUserLocation(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.isLocationActive = true;
      this.profileService.setIsLocationActive(this.isLocationActive);
      this.profileService.setGeolocationData(position.coords.latitude, position.coords.longitude);
      this.locationDetected.emit({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      this.locationToggled.emit(this.isLocationActive);

      // Convert coordinates to commune name (simplified example, use a proper geocoding service in production)
      const communeName = await this.reverseGeocode(position.coords.latitude, position.coords.longitude);
      this.communeDetected.emit(communeName);

    } catch (error) {
      console.error('Geolocation error:', error);
    }
  }

  async reverseGeocode(lat: number, lon: number): Promise<string> {
    // Use a geocoding service to convert coordinates to a location name
    // This is a simplified example using a hypothetical geocoding API
    // Replace with actual implementation
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await response.json();
    return data.city || 'Unknown location';
  }
}
