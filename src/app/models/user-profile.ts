export interface Handicap {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  pseudo: string;
  typeHandicaps: Handicap[];
}

  