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
