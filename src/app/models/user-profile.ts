export interface UserProfile {
  id: number;
  username: string;
  handicapList: Handicap[];
}

export interface Handicap {
  id: number;
  handicap: string;
}