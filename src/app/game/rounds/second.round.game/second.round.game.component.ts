import {Component} from '@angular/core';
import {MemoryGameService} from "../../../service/memory/memory.game.service";
import {Router} from "@angular/router";
import {GameReqService} from "../../../service/request/game.req.service";
import {ScoreboardService} from "../../../scoreboard/scoreboard.service";
import {SquaresService} from "../../../squares/squares.service";
import {PlayerReqService} from "../../../service/request/player.req.service";
import {Answer, Connection, Game, QuestionFirst, QuestionSecond} from "../../../models";
import {ScoreboardComponent} from "../../../scoreboard/scoreboard.component";
import {animate, style, transition, trigger} from "@angular/animations";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-second.round.game',
  standalone: true,
  imports: [
    ScoreboardComponent,
    NgStyle
  ],
  templateUrl: './second.round.game.component.html',
  styleUrl: './second.round.game.component.css',
  animations: [
    trigger('slide', [
      transition('void => *', [
        style({
          position: "relative",
          right: "-1300px",
        }),
        animate('250ms ease-out', style({
          right: "0"
        })),
      ]),
      transition('* => void', [
        style({
          position: "relative",
          left: "0"
        }),
        animate('250ms ease-in', style({
          left: "-1300px"
        }))
      ])
    ])
  ]
})
export class SecondRoundGameComponent { //TODO i want to have a OnlyConnect ass board, with 30? answers. 5 paare mit 4 connections. sobalt jemand eine hat: 15 sekunden für den rest zum aufholen -> weniger punkte. dannach nechtse "runde".
  game: Game = new Game(NaN, [], "", "");
  music = new Audio();
  questionModel: QuestionSecond;
  topQuestionModel: QuestionSecond;
  answerGroups: Answer[][] = [];
  answeredGroups: Answer[][] = [];
  groupColors = [
    '#FF000088',
    '#FFFF0088',
    '#00FF0088',
    '#00FFFF88',
    '#0000FF88',
    '#FF00FF88'
  ];
  timer: number = 100;
  maxTime: number = 100;

  constructor(
    private memory: MemoryGameService,
    private router: Router,
    private gameService: GameReqService,
    private scoreboard: ScoreboardService,
    private squares: SquaresService,
    private playerService: PlayerReqService,
  ) {
    gameService.modifyData(memory.gameId, '/idle').subscribe(game => {
      this.game = game;
    });
    this.game.questionSecond = new QuestionSecond(NaN, [ //DEBUG
      new Answer(0, "0", true, 0),
      new Answer(1, "0", true, 0),
      new Answer(2, "0", true, 0),
      new Answer(3, "0", true, 0),
      new Answer(4, "1", true, 1),
      new Answer(5, "1", true, 1),
      new Answer(6, "1", true, 1),
      new Answer(7, "1", true, 1),
      new Answer(8, "2", true, 2),
      new Answer(9, "2", true, 2),
      new Answer(10, "2", true, 2),
      new Answer(11, "2", true, 2),
      new Answer(12, "3", true, 3),
      new Answer(13, "3", true, 3),
      new Answer(14, "3", true, 3),
      new Answer(15, "3", true, 3),
      new Answer(16, "4", true, 4),
      new Answer(17, "4", true, 4),
      new Answer(18, "4", true, 4),
      new Answer(19, "4", true, 4),
      new Answer(20, "FLASE", false, NaN),
      new Answer(21, "FLASE", false, NaN),
      new Answer(22, "FLASE", false, NaN),
      new Answer(23, "FLASE", false, NaN),
      new Answer(24, "FLASE", false, NaN),
      new Answer(25, "FLASE", false, NaN),
      new Answer(26, "FLASE", false, NaN),
      new Answer(27, "FLASE", false, NaN),
    ], [
      new Connection(0, "Ex0", 0),
      new Connection(1, "Ex1", 1),
      new Connection(2, "Ex2", 2),
      new Connection(3, "Ex3", 3),
      new Connection(4, "Ex4", 4),
    ]);
    this.questionModel = new QuestionSecond(NaN, [], []);
    this.topQuestionModel = new QuestionSecond(NaN, [], []);
    this.initScoreboard();
    this.roundController();
  }

  async initScoreboard() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.scoreboard.playerSubject.next(this.memory.players);
    this.scoreboard.totalSubject.next(false);
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.scoreboard.sortSubject.next();
  }

  async roundController() {
    this.introduceQuestion();
    this.startRound();
    await this.startRotation(0);
  }

  private async startRound() {
    // await this.squares.randomPath('#000040', 12, 1, 1, false);
    // await this.squares.randomPath('#3333FF', 12, 1, 1, false);
    // await this.squares.all('#5555FF');
    // await this.squares.allFade('#000080', 1000);

    // await this.squares.randomPath('#3333FF', 12, 1, 1, false);
    // await this.squares.randomPath('#000080', 12, 1, 1, false);
    // await this.squares.all('#3333FF');
    // await this.squares.allFade('#000080', 1000);

    await this.squares.randomPath('#3333FF', 25, 1, 1, false);
    await this.squares.all('#5555FF');
    this.questionModel.answers.forEach(answer => answer.color = '#FFFFFF88')
    await this.squares.allFade('#000080', 1000);
  }

  private async introduceQuestion() {
    let answers = this.game.questionSecond.answers;
    answers = this.squares.shuffleArray(answers);
    this.questionModel.connections = this.game.questionSecond.connections;
    for (let answer of answers) {
      await new Promise(resolve => setTimeout(resolve, 2250 / answers.length));
      answers.forEach(ans => ans.color = this.groupColors[Math.floor(Math.random() * (5 + 1))]);
      this.questionModel.answers.push(answer);
      this.answerGroups = this.splitAnswersInGroupsOf4;
    }
  }

  get splitAnswersInGroupsOf4() {
    const groupedAnswers: Answer[][] = [];
    for (let i = 0; i < this.questionModel.answers.length; i += 4) {
      groupedAnswers.push(this.questionModel.answers.slice(i, i + 4));
    }
    return groupedAnswers;
  }

  private async startRotation(rotation: number) {
    if (rotation === 5) {
      this.endRound();
      return;
    }
    this.music.src = `/audio/round2bgm${rotation + 1}.mp3`;
    this.music.play();
    await new Promise(resolve => setTimeout(resolve, rotation === 0 ? 4000 : 1000));
    this.maxTime = 45;
    this.timer = 45;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.startTimer(16, rotation);
  }

  private async endRound() {
    this.music.src = `/audio/round2end.mp3`;
    this.music.play();
    this.squares.randomPath('#FFFFFF', 500, 10, 1, true)
    await new Promise(resolve => setTimeout(resolve, 7500));
    // this.router.navigateByUrl("/game/scoreboard/2")
  }

  private async revealAnswers(groupNumber: number, rotation: number) {
    await new Promise(resolve => setTimeout(resolve, 3000));

    let correctAnswers = this.questionModel.answers.filter(ans => ans.groupNumber === groupNumber);
    this.answeredGroups.push([]);
    for (let i = 0; i < 4; i++) {
      this.topQuestionModel.answers.push(correctAnswers[i]);
      this.answeredGroups[this.answeredGroups.length - 1].push(correctAnswers[i]);
      console.log(this.answeredGroups)
      this.questionModel.answers = this.questionModel.answers.filter(ans => ans.id !== correctAnswers[i].id);
      this.answerGroups = this.splitAnswersInGroupsOf4;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.startRotation(rotation + 1);
  }

  startTimer(time: number, rotation: number) {
    this.timer = time;
    this.maxTime = time;
    const interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        if (this.timer === 15) {
          this.lastTime(NaN, rotation);
        }
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  private async lastTime(groupNumber: number, rotation: number) {
    if (isNaN(groupNumber)) {
      groupNumber = this.squares.shuffleArray(this.questionModel.connections)[0].groupNumber;
    }
    this.topQuestionModel.connections.push(this.questionModel.connections.filter(con => con.groupNumber === groupNumber)[0]);
    this.questionModel.connections = this.questionModel.connections.filter(con => con.id !== this.questionModel.connections.filter(con => con.groupNumber === groupNumber)[0].id);

    let timer = new Audio("/audio/round2timer.mp3");
    timer.play();
    this.squares.line(0, '#FFFFFF', 1000, 10, 1, false)
    this.squares.line(9, '#FFFFFF', 1000, 10, 1, false, true)
    let groupColor = this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber];
    this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber] = '#FFFFFF';
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.squares.all('#000080')
    for (let i = 0; i < 14; i++) {
      if (i % 2 === 0) {
        this.squares.verticalLine(0, '#FFFFFF', 0, 1, 1, false);
        this.squares.verticalLine(9, '#FFFFFF', 0, 1, 1, false, true);
        this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber] = '#FFFFFF';
        await new Promise(resolve => setTimeout(resolve, 250));
        this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber] = groupColor;
        this.squares.allFade('#000080', 250);
      } else {
        this.squares.line(0, '#FFFFFF', 0, 1, 1, false);
        this.squares.line(9, '#FFFFFF', 0, 1, 1, false, true);
        this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber] = '#FFFFFF';
        await new Promise(resolve => setTimeout(resolve, 250));
        this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber] = groupColor;
        this.squares.allFade('#000080', 250);
      }
      await new Promise(resolve => setTimeout(resolve, 750));
    }
    this.squares.colorEdges('#FFFFFF');
    this.squares.allFade('#000080', 1000);

    await new Promise(resolve => setTimeout(resolve, 1000));

    this.revealAnswers(groupNumber, rotation);
  }

  getAnsweredForGroup(groupNumber: number) {
    return this.answeredGroups.filter(group => group[0].groupNumber === groupNumber)[0];
  }
}
