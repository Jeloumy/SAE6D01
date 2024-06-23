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
    } catch (error) {
      console.error('Geolocation error:', error);
    }
  }
}
