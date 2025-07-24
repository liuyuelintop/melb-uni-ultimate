export interface Tournament {
  _id: string;
  name: string;
  year: number;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Player {
  _id: string;
  name: string;
  gender: string;
  position: string;
  experience: string;
  jerseyNumber: number;
}

export interface RosterEntry {
  _id: string;
  playerId: Player;
  tournamentId: Tournament;
  teamId?: { name: string };
  role?: string;
  position?: string;
  notes?: string;
}
