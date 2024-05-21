import { Injectable } from '@angular/core';
import { UserProfile } from '../../models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profiles: UserProfile[] = [];
  currentProfile: UserProfile | null = null;

  constructor() { 
    this.loadProfileFromStorage();
  }

  createProfile(profile: UserProfile): void {
    profile.id = this.profiles.length + 1;
    this.profiles.push(profile);
    console.log('Profile created:', profile);
  }

  getProfiles(): UserProfile[] {
    return this.profiles;
  }

  loadProfileFromStorage(): void {
    const profileData = localStorage.getItem('currentProfile');
    if (profileData) {
      this.currentProfile = JSON.parse(profileData);
    }
  }
  
  setCurrentProfile(profile: UserProfile): void {
    this.currentProfile = profile;
    localStorage.setItem('currentProfile', JSON.stringify(profile));
  }
  
}
