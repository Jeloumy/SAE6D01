import { Injectable } from '@angular/core';
import { UserProfile, Handicap, Preference } from '../../models/user-profile';

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

  getPreferences(): Preference[] {
    return [
      { id: 1, name: 'Chemin vers l\'accueil accessible' },
      { id: 2, name: 'Dispositif d\'appel à l\'entrée' },
      { id: 3, name: 'Proximité de l\'accueil' },
      { id: 4, name: 'Présence de personnel' },
      { id: 5, name: 'Personnel sensibilisé ou formé' },
      { id: 6, name: 'Audiodescription' },
      { id: 7, name: 'Equipements spécifiques pour personne malentendante' },
      { id: 8, name: 'Chemin sans rétrécissement jusqu\'à l\'accueil ou information inconnue' },
      { id: 9, name: 'Chambre accessible' },
      { id: 10, name: 'Toilettes PMR' },
      { id: 11, name: 'Établissement labellisé' },
      { id: 12, name: 'Stationnement à proximité' },
      { id: 13, name: 'Transport en commun à proximité' },
      { id: 14, name: 'Stationnement PMR (dans l\'établissement ou à proximité)' },
      { id: 15, name: 'Maximum une marche à l\'entrée' },
      { id: 16, name: 'Maximum une marche à l\'accueil' },
      { id: 17, name: 'Entrée accessible' },
      { id: 18, name: 'Largeur de porte supérieure à 80cm ou information inconnue' },
      { id: 19, name: 'Entrée spécifique PMR' },
      { id: 20, name: 'Balise sonore' },
      { id: 21, name: 'Pas de chemin extérieur ou information inconnue' },
      { id: 22, name: 'Chemin adapté aux personnes mal marchantes' },
      { id: 23, name: 'Extérieur - plain-pied ou accessible via rampe ou ascenseur' },
      { id: 24, name: 'Chemin extérieur accessible' },
      { id: 25, name: 'Extérieur - bande de guidage' }
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
