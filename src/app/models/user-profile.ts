export interface Handicap {
  id: number;
  name: string;
}

export interface Preference {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  pseudo: string;
  typeHandicaps: Handicap[];
  preferences: Preference[];
}
