export class Player {
  id: number;
  name: string;
  gameScore: number;
  totalScore: number;
  hidden: boolean;
  color: string;
  input: string;
  correct: boolean; //ONLY USE FOR SCOREBOARD!

  constructor(id: number, name: string, gameScore: number, totalScore: number) {
    this.id = id;
    this.name = name;
    this.gameScore = gameScore;
    this.totalScore = totalScore;
    this.hidden = false;
    this.color = 'white';
    this.input = '';
    this.correct = false;
  }
}

export class Game {
  id: number;
  players: Player[];
  route: string;
  data: string;
  questionFirsts: QuestionFirst[];
  questionSecond: QuestionSecond;


  constructor(id: number, players: Player[], route: string, data: string) {
    this.id = id;
    this.players = players;
    this.route = route;
    this.data = data;
    this.questionFirsts = [];
    this.questionSecond = new QuestionSecond(NaN, [], [])
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

export class QuestionSecond {
  id: number;
  answers: Answer[];
  connections: Connection[];

  constructor(id: number, answers: Answer[], connections: Connection[]) {
    this.id = id;
    this.answers = answers;
    this.connections = connections;
  }
}

export class Connection {
  id: number;
  explanation: string;
  groupNumber: number;

  constructor(id: number, explanation: string, groupNumber: number) {
    this.id = id;
    this.explanation = explanation;
    this.groupNumber = groupNumber;
  }
}

export class Answer {
  id: number;
  answer: string;
  isCorrect: boolean;
  groupNumber: number;
  color: string;
  players: Player[];

  constructor(id: number, answer: string, isCorrect: boolean, groupNumber: number) {
    this.id = id;
    this.answer = answer;
    this.isCorrect = isCorrect;
    this.groupNumber = groupNumber;
    this.color = "#000000";
    this.players = [];
  }
}
