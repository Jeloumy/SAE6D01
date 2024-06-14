import { Injectable } from '@angular/core';
import { UserProfile, Handicap, DispositifLieu, SystemPreferences } from '../../models/definitions';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeService } from '../theme/theme.service'; // Import ThemeService

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profilesList: UserProfile[] = [];
  private currentProfileSubject: BehaviorSubject<UserProfile | null> = new BehaviorSubject<UserProfile | null>(null);
  currentProfile$: Observable<UserProfile | null> = this.currentProfileSubject.asObservable();
  private preferencesSubject: BehaviorSubject<SystemPreferences | null> = new BehaviorSubject<SystemPreferences | null>(null);
  preferences$: Observable<SystemPreferences | null> = this.preferencesSubject.asObservable();

  private geolocationData: { latitude: number | null, longitude: number | null } | null = null;
  private geolocationSubject = new BehaviorSubject<{ latitude: number | null, longitude: number | null }>({ latitude: null, longitude: null });

  private isLocationActiveSubject = new BehaviorSubject<boolean>(false);

  constructor(private themeService: ThemeService) { // Inject ThemeService
    this.loadProfileFromStorage();
    this.loadProfilesListFromStorage();
  }

  setGeolocationData(latitude: number | null, longitude: number | null): void {
    this.geolocationData = { latitude, longitude };
    localStorage.setItem('geolocationData', JSON.stringify(this.geolocationData));
    this.geolocationSubject.next(this.geolocationData);
  }

  getGeolocationData(): { latitude: number | null, longitude: number | null } | null {
    if (!this.geolocationData) {
      const storedData = localStorage.getItem('geolocationData');
      if (storedData) {
        this.geolocationData = JSON.parse(storedData);
      }
    }
    return this.geolocationData;
  }

  getGeolocationUpdates() {
    return this.geolocationSubject.asObservable();
  }

  setIsLocationActive(isActive: boolean): void {
    this.isLocationActiveSubject.next(isActive);
  }

  getIsLocationActive() {
    return this.isLocationActiveSubject.asObservable();
  }

  getHandicapTypes(): Handicap[] {
    return [
      { id: 1, handicap: 'Difficulté à voir' },
      { id: 2, handicap: 'En fauteuil roulant' },
      { id: 3, handicap: 'Difficulté à marcher' },
      { id: 4, handicap: 'Difficulté à entendre' },
      { id: 5, handicap: 'Difficulté à comprendre' }
    ];
  }

  getDispositifLieu(): DispositifLieu[] {
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
    const existingProfile = this.profilesList.find(p => p.username.toLowerCase() === profile.username.toLowerCase());
    if (existingProfile) {
      console.log('Profile creation failed: username already exists.');
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
    this.reassignIds();
    this.saveProfilesListToStorage();
    if (this.currentProfileSubject.value?.id === profileId) {
      this.setCurrentProfile(null);
    }
  }

  updateProfile(profile: UserProfile): void {
    const index = this.profilesList.findIndex(p => p.id === profile.id);
    if (index !== -1) {
      this.profilesList[index] = profile;
      this.saveProfilesListToStorage();
      if (profile.id === this.currentProfileSubject.value?.id) {
        this.setCurrentProfile(profile);
      }
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
      const profile = JSON.parse(profileData);
      this.currentProfileSubject.next(profile);
      this.preferencesSubject.next(profile.systemPreferences || {});
      // Définir le thème en fonction des préférences du profil
      if (profile.systemPreferences?.highContrast) {
        this.themeService.setTheme('contrast');
      } else if (profile.systemPreferences?.darkMode) {
        this.themeService.setTheme('dark');
      } else {
        this.themeService.setTheme('light');
      }
    }
  }

  setCurrentProfile(profile: UserProfile | null): void {
    this.currentProfileSubject.next(profile);
    if (profile) {
      localStorage.setItem('currentProfile', JSON.stringify(profile));
      this.preferencesSubject.next(profile.systemPreferences || {});
      // Définir le thème en fonction des préférences du profil
      if (profile.systemPreferences?.highContrast) {
        this.themeService.setTheme('contrast');
      } else if (profile.systemPreferences?.darkMode) {
        this.themeService.setTheme('dark');
      } else {
        this.themeService.setTheme('light');
      }
    } else {
      localStorage.removeItem('currentProfile');
      this.preferencesSubject.next(null);
      this.themeService.setTheme('light'); // Par défaut à 'light' si aucun profil
    }
  }

  getCurrentProfile(): UserProfile | null {
    return this.currentProfileSubject.value;
  }

  getCurrentProfileSettings(): SystemPreferences | null {
    return this.currentProfileSubject.value?.systemPreferences || {};
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
