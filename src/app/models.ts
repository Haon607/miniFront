export class Player {
  id: number;
  name: string;
  gameScore: number;
  totalScore: number;
  hidden: boolean;
  fontColor: string;
  private playerColor: string;
  input: string;
  correct: boolean; //ONLY USE FOR SCOREBOARD!
  textBg: string[]; //ONLY USE FOR SCOREBOARD!

  constructor(
    id: number = 0,
    name: string = '',
    gameScore: number = 0,
    totalScore: number = 0,
    hidden: boolean = false,
    fontColor: string = '#000000',
    playerColor: string = '',
    input: string = '',
    correct: boolean = false,
    textBg: string[] = ['#00000000', '#00000000']
  ) {
    this.id = id;
    this.name = name;
    this.gameScore = gameScore;
    this.totalScore = totalScore;
    this.hidden = hidden;
    this.fontColor = fontColor;
    this.playerColor = playerColor;
    this.input = input;
    this.correct = correct;
    this.textBg = textBg;
  }

  get color() {
    return this.playerColor === '' ? '#FFFFFF' : this.playerColor;
  }

  set color(color: string) {
    this.playerColor = color;
  }
}

export class Game {
  id: number;
  players: Player[];
  route: string;
  data: string;
  rounds: Round[];

  constructor(
    id: number = 0,
    players: Player[] = [],
    route: string = '',
    data: string = '',
    rounds: Round[] = []
  ) {
    this.id = id;
    this.players = players;
    this.route = route;
    this.data = data;
    this.rounds = rounds;
  }
}

export class Answer {
  id: number;
  answer: string;
  isCorrect: boolean;
  groupNumber: number;
  color: string;
  players: Player[];

  constructor(
    id: number = 0,
    answer: string = '',
    isCorrect: boolean = false,
    groupNumber: number = 0,
    color: string = 'black',
    players: Player[] = []
  ) {
    this.id = id;
    this.answer = answer;
    this.isCorrect = isCorrect;
    this.groupNumber = groupNumber;
    this.color = color;
    this.players = players;
  }
}

export class Round {
  id: number;
  name: string;
  rules: string;
  route: string;
  large: boolean;
  questions: Question[];
  data: string;

  constructor(
    id: number = 0,
    name: string = '',
    rules: string = '',
    route: string = '',
    large: boolean = false,
    questions: Question[] = [],
    data: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.rules = rules;
    this.route = route;
    this.large = large;
    this.questions = questions;
    this.data = data;
  }
}

export class Question {
  id: number;
  data: string;

  constructor(
    id: number = 0,
    data: string = ''
  ) {
    this.id = id;
    this.data = data;
  }
}
