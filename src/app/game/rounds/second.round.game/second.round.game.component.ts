import { Component } from '@angular/core';
import { MemoryGameService } from "../../../service/memory/memory.game.service";
import { Router } from "@angular/router";
import { GameReqService } from "../../../service/request/game.req.service";
import { ScoreboardService } from "../../../scoreboard/scoreboard.service";
import { SquaresService } from "../../../squares/squares.service";
import { PlayerReqService } from "../../../service/request/player.req.service";
import { Answer, Game, Player, QuestionSecond } from "../../../models";
import { ScoreboardComponent } from "../../../scoreboard/scoreboard.component";
import { animate, style, transition, trigger } from "@angular/animations";
import { NgStyle } from "@angular/common";
import { ColorFader } from "../../../utils";

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
export class SecondRoundGameComponent {
  game: Game = new Game(NaN, [], "", "");
  music = new Audio();
  questionModel: QuestionSecond;
  topQuestionModel: QuestionSecond;
  answerGroups: Answer[][] = [];
  answeredGroups: Answer[][] = [];
  groupColors = [
    '#FFAAFF88',
    '#FFAAAA88',
    '#FFFFAA88',
    '#AAFFAA88',
    '#AAFFFF88',
    '#AAAAFF88',
  ];
  timer: number = 100;
  maxTime: number = 100;
  private currentGroup: number = NaN;

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
    this.questionModel = new QuestionSecond(NaN, [], []);
    this.topQuestionModel = new QuestionSecond(NaN, [], []);
    this.initScoreboard();
    this.roundController();
  }

  get splitAnswersInGroupsOf4() {
    const groupedAnswers: Answer[][] = [];
    for (let i = 0; i < this.questionModel.answers.length; i += 4) {
      groupedAnswers.push(this.questionModel.answers.slice(i, i + 4));
    }
    return groupedAnswers;
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

  startTimer(time: number, rotation: number) {
    this.timer = time;
    this.maxTime = time;
    const interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer -= 0.5;
        if (this.timer === 15) {
          this.lastTime(this.currentGroup, rotation);
        }
        this.checkAnswers(rotation);
      } else {
        clearInterval(interval);
      }
    }, 500);
  }

  getAnsweredForGroup(groupNumber: number) {
    return this.answeredGroups.filter(group => group[0].groupNumber === groupNumber)[0];
  }

  async checkAnswers(rotation: number) {
    this.gameService.getGame(this.memory.gameId).subscribe(game => {
      game.players.forEach(gamePlayer => {
        const memoryPlayer = this.memory.players.find(memoryPlayer => gamePlayer.id === memoryPlayer.id);
        if (memoryPlayer) {
          memoryPlayer.input = gamePlayer.input;
        }
      });
      for (let player of this.memory.players) {
        if (player.input && player.input !== 'valid') {
          let {answers, valid} = this.answersValid(player, 'before');
          if (valid) {
            this.playerService.setInput(player.id, 'valid').subscribe(() => {
            });
            new Audio('/audio/round2correct.mp3').play();
            if (this.timer > 15) {
              if (this.memory.players.length > 1) {
                this.timer = 15.5;
                this.maxTime = 15;
              } else {
                this.timer = 0;
                this.lastTime(answers[0].groupNumber, rotation)
              }
              if (isNaN(this.currentGroup)) {
                this.currentGroup = answers[0].groupNumber;
              }
            }
          } else {
            this.playerService.setInput(player.id, 'invalid').subscribe(() => {
            });
            for (let answer of answers) {
              new ColorFader().fadeColor('#FF880088', '#FFFFFF88', 1000, col => this.questionModel.answers.filter(ans => ans.id === answer.id)[0].color = col);
            }
            new Audio('/audio/round2wrong.mp3').play();
          }
        }
      }
    })
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
    await new Promise(resolve => setTimeout(resolve, 250));
    let answers = this.game.questionSecond.answers;
    answers = this.squares.shuffleArray(answers);
    this.questionModel.connections = this.game.questionSecond.connections;
    for (let answer of answers) {
      await new Promise(resolve => setTimeout(resolve, 2000 / answers.length));
      answers.forEach(ans => ans.color = this.groupColors[Math.floor(Math.random() * (5 + 1))]);
      this.questionModel.answers.push(answer);
      this.answerGroups = this.splitAnswersInGroupsOf4;
    }
  }

  private async startRotation(rotation: number) {
    if (rotation === 5) {
      this.endRound();
      return;
    }
    this.music.src = `/audio/round2bgm${rotation + 1}.mp3`;
    this.music.play();
    this.currentGroup = NaN;
    await new Promise(resolve => setTimeout(resolve, rotation === 0 ? 4000 : 1000));
    this.playerService.deleteInputs().subscribe(() => {
    });
    let answerString = "";
    for (let answerGroup of this.splitAnswersInGroupsOf4) {
      answerString = answerString + '§';
      for (let answer of answerGroup) {
        answerString = answerString + ';' + answer.answer;
      }
    }
    this.gameService.modifyData(this.memory.gameId, "/select/2", answerString.substring(1)).subscribe(() => {
    })
    this.maxTime = 45;
    this.timer = 45;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.startTimer(45, rotation);
  }

  private async endRound() {
    this.music.src = `/audio/round2end.mp3`;
    this.music.play();
    this.questionModel.answers.filter(ans => ans.groupNumber === -1).forEach(ans => ans.color = this.groupColors[5])
    this.squares.randomPath('#FFFFFF', 500, 10, 1, true)
    await new Promise(resolve => setTimeout(resolve, 7500));
    this.router.navigateByUrl("/game/scoreboard/2")
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
    this.allocatePoints(groupNumber);
    await new Promise(resolve => setTimeout(resolve, 2500));
    this.scoreboard.sortSubject.next();
    await new Promise(resolve => setTimeout(resolve, 2500));
    this.startRotation(rotation + 1);
  }

  private async lastTime(groupNumber: number, rotation: number) {
    if (isNaN(groupNumber)) {
      groupNumber = this.squares.shuffleArray(this.questionModel.connections)[0].groupNumber;
      this.currentGroup = groupNumber;
    }
    this.topQuestionModel.connections.push(this.questionModel.connections.filter(con => con.groupNumber === groupNumber)[0]);
    this.questionModel.connections = this.questionModel.connections.filter(con => con.id !== this.questionModel.connections.filter(con => con.groupNumber === groupNumber)[0].id);
    if (this.timer !== 0) {
      let timer = new Audio("/audio/round2timer.mp3");
      timer.play();
      this.squares.line(0, '#5555FF', 1000, 10, 1, false)
      this.squares.line(9, '#5555FF', 1000, 10, 1, false, true)
      let groupColor = this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber];
      this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber] = '#FFFFFF';
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.squares.all('#000080')
      for (let i = 0; i < 14; i++) {
        if (i % 2 === 0) {
          this.squares.verticalLine(0, '#3333FF', 0, 1, 1, false);
          this.squares.verticalLine(9, '#3333FF', 0, 1, 1, false, true);
          this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber] = '#FFFFFF';
          await new Promise(resolve => setTimeout(resolve, 250));
          this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber] = groupColor;
          this.squares.allFade('#000080', 250);
        } else {
          this.squares.line(0, '#3333FF', 0, 1, 1, false);
          this.squares.line(9, '#3333FF', 0, 1, 1, false, true);
          this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber] = '#FFFFFF';
          await new Promise(resolve => setTimeout(resolve, 250));
          this.groupColors[this.topQuestionModel.connections[this.topQuestionModel.connections.length - 1].groupNumber] = groupColor;
          this.squares.allFade('#000080', 250);
        }
        await new Promise(resolve => setTimeout(resolve, 750));
      }
    }
    this.squares.colorEdges('#5555FF');
    this.squares.allFade('#000080', 1000);

    await new Promise(resolve => setTimeout(resolve, 1000));

    this.gameService.modifyData(this.memory.gameId, "/idle", '').subscribe(game => {
      game.players.forEach(gamePlayer => {
        const memoryPlayer = this.memory.players.find(memoryPlayer => gamePlayer.id === memoryPlayer.id);
        if (memoryPlayer) {
          memoryPlayer.input = gamePlayer.input;
        }
      });
    });

    this.revealAnswers(groupNumber, rotation);
  }

  private answersValid(player: Player, when: 'before' | 'after') {
    let answers: Answer[] = [];
    for (let answer of player.input.split(';')) {
      if (when === 'before') {
        answers.push(this.questionModel.answers.filter(ans => ans.answer === answer)[0]);
      } else if (when === 'after') {
        answers.push(this.topQuestionModel.answers.filter(ans => ans.answer === answer)[0]);
      }
    }
    let valid: boolean = answers.length === 4;
    for (let i = 0; i < 3 && valid; i++) {
      if (isNaN(this.currentGroup)) {
        valid = answers[i].groupNumber === answers[i + 1].groupNumber && answers[i].groupNumber !== -1;
      } else {
        valid = answers[i].groupNumber === answers[i + 1].groupNumber && answers[i].groupNumber !== -1 && answers[i].groupNumber === this.currentGroup;
      }
    }
    if (valid) {
      this.awardPoint(player, Math.floor(Math.max(25, Math.min(this.timer, 15) * 10)));
    }
    return {answers, valid};
  }

  private allocatePoints(groupNumber: number) {
    for (let player of this.memory.players) {
      if (player.input === 'valid') {
        // this.awardPoint(player, 100);
      } else {
        let {valid} = this.answersValid(player, 'after');
        if (valid) {
          // this.awardPoint(player, 100)
        }
      }
    }
  }

  private async awardPoint(player: Player, points: number) {
    player.correct = true;
    const goal = player.gameScore + points;
    while (player.gameScore < goal) {
      player.gameScore += 1;
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    player.gameScore = goal;
  }
}
