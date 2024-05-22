import { Injectable } from '@angular/core';
import { UserProfile, Handicap } from '../../models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profilesList: UserProfile[] = [];
  currentProfile: UserProfile | null = null;

  constructor() { 
    this.loadProfileFromStorage();
    this.loadProfilesListFromStorage();
  }

  getHandicapTypes(): Handicap[] {
    return [
      { id: 1, name: 'Difficulté à voir' },
      { id: 2, name: 'En fauteuil roulant' },
      { id: 3, name: 'Difficulté à marcher' },
      { id: 4, name: 'Difficulté à entendre' },
      { id: 5, name: 'Difficulté à comprendre' }
    ];
  }

  createProfile(profile: UserProfile): boolean {
    const existingProfile = this.profilesList.find(p => p.pseudo.toLowerCase() === profile.pseudo.toLowerCase());
    if (existingProfile) {
      console.log('Profile creation failed: Pseudo already exists.');
      return false;
    }

    profile.id = this.getNextId();
    this.profilesList.push(profile);
    this.saveProfilesListToStorage();
    console.log('Profile created:', profile);
    return true;
  }

  getProfilesList(): UserProfile[] {
    return this.profilesList;
  }

  deleteProfile(profileId: number): void {
    this.profilesList = this.profilesList.filter(profile => profile.id !== profileId);
    this.reassignIds(); // Réassigne les IDs pour maintenir une séquence continue
    this.saveProfilesListToStorage();
    if (this.currentProfile?.id === profileId) {
      this.currentProfile = null;
      localStorage.removeItem('currentProfile');
    }
  }

  updateProfile(profile: UserProfile): void {
    const index = this.profilesList.findIndex(p => p.id === profile.id);
    if (index !== -1) {
      this.profilesList[index] = profile;
      this.saveProfilesListToStorage();
    }
  }

  loadProfilesListFromStorage(): void {
    const profilesListData = localStorage.getItem('profilesList');
    if (profilesListData) {
      this.profilesList = JSON.parse(profilesListData);
    }
  }

  saveProfilesListToStorage(): void {
    localStorage.setItem('profilesList', JSON.stringify(this.profilesList));
  }

  loadProfileFromStorage(): void {
    const profileData = localStorage.getItem('currentProfile');
    if (profileData) {
      this.currentProfile = JSON.parse(profileData);
    }
  }
  
  setCurrentProfile(profile: UserProfile | null): void {
    this.currentProfile = profile;
    if (profile) {
      localStorage.setItem('currentProfile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('currentProfile');
    }
  }

  getCurrentProfile(): UserProfile | null {
    return this.currentProfile;
  }

  private getNextId(): number {
    const maxId = this.profilesList.reduce((max, profile) => profile.id > max ? profile.id : max, 0);
    return maxId + 1;
  }

  private reassignIds(): void {
    this.profilesList = this.profilesList.map((profile, index) => ({
      ...profile,
      id: index + 1
    }));
  }
}
