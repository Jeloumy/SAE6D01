export interface Handicap {
  id: number;
  handicap: string;
}

// export interface Preference {
//   id: number;
//   name: string;
// }

export interface DispositifLieu {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  username: string;
  handicapList: Handicap[];
  dispositifLieu: DispositifLieu[];
}
