export interface Handicap {
  id: number;
  handicap: string;
}

export interface DispositifLieu {
  id: number;
  name: string;
}

export interface SystemPreferences {
  colorBlindMode?: boolean;
  highContrast?: boolean;
  brightness?: number;
  blackAndWhite?: boolean;
  [key: string]: any;
}

export interface UserProfile {
  id: number;
  username: string;
  handicapList: Handicap[];
  dispositifLieu: DispositifLieu[];
  photo?: string;
  systemPreferences?: SystemPreferences;
}
