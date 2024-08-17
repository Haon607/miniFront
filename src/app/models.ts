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
  route: string;
  data: string;
  questionFirsts: QuestionFirst[];


  constructor(id: number, players: Player[], route: string, data: string) {
    this.id = id;
    this.players = players;
    this.route = route;
    this.data = data;
    this.questionFirsts = [];
  }
}

export class QuestionFirst {
  id: number;
  question: string;
  answers: Answer[];

  constructor(id: number, question: string, answers: Answer[]) {
    this.id = id;
    this.question = question;
    this.answers = answers;
  }
}

export class Answer {
  id: number;
  answer: string;
  isCorrect: boolean;
  likely: number;

  constructor(id: number, answer: string, isCorrect: boolean, likely: number) {
    this.id = id;
    this.answer = answer;
    this.isCorrect = isCorrect;
    this.likely = likely;
  }
}
