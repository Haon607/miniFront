import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { GameReqService } from "../../service/request/game.req.service";
import { Game, QuestionFirst } from "../../models";
import { ScoreboardComponent } from "../../scoreboard/scoreboard.component";
import { ScoreboardService } from "../../scoreboard/scoreboard.service";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { SquaresService } from "../../squares/squares.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-first.round.game',
  standalone: true,
  imports: [
    ScoreboardComponent,
    NgStyle
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
    for (let i = 0; i < 6; i++) {
      await this.introduceQuestion(i);
      await this.startTimer(i);
      await this.revealAnswers(i);
      if (i < 5) {
        await this.eliminateAnswers(i);
      }
    }
    // this.router.navigateByUrl("/rules/2")
  }

  private async startTimer(questionNumber: number) {
    this.music.pause();
    this.music.src = "/audio/round1timer" + (questionNumber + 1) + ".mp3";
    this.music.play();

    this.squares.line(0, '#3333FF', 1000, 1, 1, false, false)
    this.squares.line(9, '#3333FF', 1000, 1, 1, false, true)
    await new Promise(resolve => setTimeout(resolve, 10000))

    this.squares.all('#5555FF')
    this.squares.allFade('#000080', 250)

    await new Promise(resolve => setTimeout(resolve, 2500))
  }

  private async introduceQuestion(questionNumber: number) {
    this.music.pause();
    this.music.src = "/audio/round1question.mp3";
    this.music.play();

    this.questionModel.question = "FRAGE " + (questionNumber + 1);

    await new Promise(resolve => setTimeout(resolve, 1000))

    this.questionModel.question = this.game!.questionFirsts[questionNumber].question;

    await new Promise(resolve => setTimeout(resolve, 3000))

    let currentAnswers = this.game!.questionFirsts[questionNumber].answers;

    currentAnswers = currentAnswers.filter(ans => ans.likely > questionNumber);

    for (let answer of currentAnswers) {
      answer.color = "#FFFFFF88"
      this.questionModel.answers.push(answer);
      await new Promise(resolve => setTimeout(resolve, 25));
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  private async startRound() {
    this.music.src = "/audio/round1start.mp3";
    this.music.play();
    await this.squares.randomPath('#3333FF', 15, 1, 1, false);
    await this.squares.all('#5555FF');
    await this.squares.allFade('#000080', 5000);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  private async revealAnswers(questionNumber: number) {
    let sfx = new Audio("/audio/answer_reveal.mp3");
    sfx.play();

    this.squares.allLine('#3333FF', 500, 5, 1, true, true);

    await new Promise(resolve => setTimeout(resolve, 5000));

    sfx.src = "/audio/right_or_wrong.mp3";
    sfx.play();

    this.setAnswerColors();

    await this.squares.allLine('#008000', 250, 5, 2, true, false, '#800000'); //TODO, all one color when all right or all wrong

    await new Promise(resolve => setTimeout(resolve, 8000));
  }

  private async eliminateAnswers(questionNumber: number) {
    let sfx = new Audio("/audio/elimination.mp3");
    sfx.play();
    this.questionModel.answers = this.questionModel.answers.filter(ans => ans.likely > questionNumber + 1);
    this.questionModel.answers.forEach(ans => ans.color = '#FFFFFF88');
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.questionModel.question = "";
    this.questionModel.answers = [];
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async setAnswerColors() {
    for (let answer of this.questionModel.answers) {
      answer.color = answer.isCorrect ? '#00FF0088' : '#FF000088';
      await new Promise(resolve => setTimeout(resolve, 1500 / this.questionModel.answers.length));
    }
  }
}
