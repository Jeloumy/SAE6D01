export interface Handicap {
  id: number;
  handicap: string;
}

export interface DispositifLieu {
  id: number;
  name: string;
}

export interface SystemPreferences {
  colorBlindMode?: string;
  highContrast?: boolean;
  brightness?: number;
  blackAndWhite?: boolean;
  darkMode?: boolean;
  textSize?: string;
  buttonSize?: string;
  screenReader?: boolean;
  voiceCommands?: boolean;
  customColors?: {
    background: string;
    text: string;
  };
  contextualHelp?: boolean;
  interactiveTutorials?: boolean;
  [key: string]: any; // Ajoutez cette ligne
}


export interface UserProfile {
  id: number;
  username: string;
  handicapList: Handicap[];
  dispositifLieu: DispositifLieu[];
  photo?: string;
  systemPreferences?: SystemPreferences;
}
