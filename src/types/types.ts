export interface Card {
  id: number;
  color: string;
  value: string;
  image: string;
  description: string;
}
export interface CardPlayable {
  id: number;
  color: string;
  value: string;
}
export interface GameStatusProps {
  game_id: number;
  status: string;
  current_player: string;
  direction: string;
  top_card: string;
  players: {
    [playerName: string]: {
      wins: number;
      cards: Card[];
    };
  };
  turnHistory: any[];
}

export interface GameProps {
  id: number;
  title: string;
  status: string;
  maxPlayers: number;
  creator: string;
  players: string[];
}

export interface Scores {
  [playerName: string]: number;
}
