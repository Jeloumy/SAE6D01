import { Injectable } from '@angular/core';
import { UserProfile } from '../../models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profiles: UserProfile[] = [];
  currentProfile: UserProfile | null = null;
  private static nextId: number = 1;

  constructor() { 
    this.loadProfileFromStorage();
  }

  createProfile(profile: UserProfile): void {
    profile.id = ProfileService.nextId++;
    this.profiles.push(profile);
    console.log('Profile created:', profile);
  }

  getProfiles(): UserProfile[] {
    return this.profiles;
  }

  deleteProfile(profileId: number): void {
    this.profiles = this.profiles.filter(profile => profile.id !== profileId);
    if (this.currentProfile?.id === profileId) {
      this.currentProfile = null;
      localStorage.removeItem('currentProfile');
    }
  }

  updateProfile(profile: UserProfile): void {
    const index = this.profiles.findIndex(p => p.id === profile.id);
    if (index !== -1) {
      this.profiles[index] = profile;
    }
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
