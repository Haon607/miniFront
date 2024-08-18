import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { GameReqService } from "../../service/request/game.req.service";
import { Game, QuestionFirst } from "../../models";
import { ScoreboardComponent } from "../../scoreboard/scoreboard.component";
import { ScoreboardService } from "../../scoreboard/scoreboard.service";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { SquaresService } from "../../squares/squares.service";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-first.round.game',
  standalone: true,
  imports: [
    ScoreboardComponent
  ],
  templateUrl: './first.round.game.component.html',
  styleUrl: './first.round.game.component.css',
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
export class FirstRoundGameComponent {
  game?: Game;
  music = new Audio();
  questionModel: QuestionFirst;

  constructor(
    private memory: MemoryGameService,
    private router: Router,
    private gameService: GameReqService,
    private scoreboard: ScoreboardService,
    private squares: SquaresService,
  ) {
    gameService.modifyData(memory.gameId, '/idle').subscribe(game => {
      this.game = game;
    });
    this.questionModel = new QuestionFirst(NaN, "", []);
    this.initScoreboard();
    this.roundController();
  }

  async initScoreboard() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.scoreboard.playerSubject.next(this.memory.players);
    this.scoreboard.sortSubject.next();
    this.scoreboard.totalSubject.next(false);
  }

  async roundController() {
    await this.startRound();
    for (let i = 0; i < 1/*6 debug*/; i++) {
      await this.introduceQuestion(i);
      await this.startQuestion(i);
    }
  }

  async startQuestion(questionNumber: number) {
    this.music.pause();
    this.music.src = "/audio/round1timer" + (questionNumber+1) + ".mp3";
    this.music.play();


    // await this.squares.circle('#000000', 27, 1, 10, true);

    this.squares.allLineAlt('#3333FF', 1000, 1, 1, false)
    await new Promise(resolve => setTimeout(resolve, 10000))

    this.squares.all('#5555FF')
    this.squares.allFade('#000080', 1000)
  }

  async introduceQuestion(questionNumber: number) {
    this.music.pause();
    this.music.src = "/audio/round1question.mp3";
    this.music.play();

    this.questionModel.question = "FRAGE " + (questionNumber+1);

    await new Promise(resolve => setTimeout(resolve, 1000))

    this.questionModel.question = this.game!.questionFirsts[questionNumber].question;

    await new Promise(resolve => setTimeout(resolve, 3000))

    const currentAnswers = this.game!.questionFirsts[questionNumber].answers

    for (let answer of currentAnswers) {
      this.questionModel.answers.push(answer);
      await new Promise(resolve => setTimeout(resolve, 25));
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  async startRound() {
    this.music.src = "/audio/round1start.mp3";
    this.music.play();
    await this.squares.randomPath('#3333FF', 15, 1, 1, false);
    await this.squares.all('#5555FF');
    await this.squares.allFade('#000080', 5000);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
