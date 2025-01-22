export interface Team {
  id: string;
  name: string;
}

export interface Game {
  score1: number;
  score2: number;
  winner?: Team;
  loser?: Team;
  isComplete: boolean;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  winner?: Team;
  loser?: Team;
  score1: number;
  score2: number;
  isComplete: boolean;
  isBestOfThree?: boolean;
  games?: Game[];
  currentGame?: number;
}