export class Player {
  id: number;
  name: string;
  gameScore: number;
  totalScore: number;
  hidden: boolean;
  color: string;

  constructor(id: number, name: string, gameScore: number, totalScore: number) {
    this.id = id;
    this.name = name;
    this.gameScore = gameScore;
    this.totalScore = totalScore;
    this.hidden = false;
    this.color = 'white'
  }
}

export class Game {
  id: number;
  players: Player[];
  data: string;

  constructor(id: number, players: Player[], data: string) {
    this.id = id;
    this.players = players;
    this.data = data;
  }
}
