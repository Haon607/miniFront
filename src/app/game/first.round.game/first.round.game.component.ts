import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { GameReqService } from "../../service/request/game.req.service";
import { Game, Player, QuestionFirst } from "../../models";
import { ScoreboardComponent } from "../../scoreboard/scoreboard.component";
import { ScoreboardService } from "../../scoreboard/scoreboard.service";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { SquaresService } from "../../squares/squares.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { NgStyle } from "@angular/common";
import { PlayerReqService } from "../../service/request/player.req.service";

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
    private playerService: PlayerReqService,
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
    this.scoreboard.totalSubject.next(false);
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.scoreboard.sortSubject.next();
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
    this.music.pause();
    this.router.navigateByUrl("/game/scoreboard/1")
  }

  private async startTimer(questionNumber: number) {
    let selectable = '';
    for (let ans of this.questionModel.answers) {
      selectable = selectable + '§' + ans.answer;
    }
    this.gameService.modifyData(this.memory.gameId, '/select', selectable.substring(1)).subscribe(game => {});

    this.music.pause();
    this.music.src = "/audio/round1timer" + (questionNumber + 1) + ".mp3";
    this.music.play();

    this.squares.line(0, '#3333FF', 1000, 1, 1, false, false)
    this.squares.line(9, '#3333FF', 1000, 1, 1, false, true)
    await new Promise(resolve => setTimeout(resolve, 10000))

    this.gameService.modifyData(this.memory.gameId, "/idle", '').subscribe(game => {});


    this.squares.all('#5555FF')
    this.squares.allFade('#000080', 250)

    await new Promise(resolve => setTimeout(resolve, 1000))

    this.gameService.getGame(this.memory.gameId).subscribe(game => {
      game.players.forEach(gamePlayer => {
        const memoryPlayer = this.memory.players.find(memoryPlayer => gamePlayer.id === memoryPlayer.id);
        if (memoryPlayer) {
          memoryPlayer.input = gamePlayer.input;
        }
      });
    })

    await new Promise(resolve => setTimeout(resolve, 1500))
  }

  private async introduceQuestion(questionNumber: number) {
    this.questionModel.question = "FRAGE " + (questionNumber + 1);
    this.squares.circle('#3333FF', 200, 5);
    await new Promise(resolve => setTimeout(resolve, 2000))

    this.music.pause();
    this.music.src = "/audio/round1question.mp3";
    this.music.play();
    this.squares.colorEdges('#5555FF');
    this.squares.fadeEdges('#000080', 4000);
    this.playerService.deleteInputs().subscribe(() => {})
    this.questionModel.question = this.game!.questionFirsts[0].question;
    await new Promise(resolve => setTimeout(resolve, 3000))

    let currentAnswers = this.game!.questionFirsts[0].answers;
    currentAnswers = this.squares.shuffleArray(currentAnswers);
    currentAnswers = currentAnswers.filter(ans => ans.likely > questionNumber);
    for (let answer of currentAnswers) {
      answer.color = "#FFFFFF88";
      answer.players = [];
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
    await this.squares.allFade('#000080', 1000);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  private async revealAnswers(questionNumber: number) {
    let sfx = new Audio("/audio/answer_reveal.mp3");
    sfx.play();

    this.questionModel.answers.forEach(ans => ans.players = []);

    for (let player of this.memory.players) {
      if (player) {
        let selectedAnswer = this.questionModel.answers.filter(ans => ans.answer === player.input)[0];
        if (selectedAnswer) {
          selectedAnswer.players.push(player);
          selectedAnswer.color = '#FFAA0088'
          this.questionModel.answers.filter(ans => ans.answer === player.input)[0] = selectedAnswer;
        }
      }
    }

    this.squares.allLine('#3333FF', 500, 5, 1, true, true);

    await new Promise(resolve => setTimeout(resolve, 5000));

    sfx.src = "/audio/right_or_wrong.mp3";
    sfx.play();

    let allRight = true;
    let allWrong = true;

    for (let player of this.memory.players) {
      let selectedAnswer = this.questionModel.answers.find(ans => ans.answer === player.input);
      if (selectedAnswer && selectedAnswer.isCorrect) {
        this.awardPoint(player, questionNumber)
        allWrong = false;
      } else {
        allRight = false;
      }
    }

    this.setAnswerColors();

    await this.squares.allLine(allWrong ? '#800000' : '#008000', 250, 5, 2, true, false, allRight ? '#008000' :'#800000');

    await new Promise(resolve => setTimeout(resolve, 4000));
    this.scoreboard.sortSubject.next();
    await new Promise(resolve => setTimeout(resolve, 4000));
  }

  private calculatePoints(questionNumber: number): number {
    switch (questionNumber + 1) {
      case 1:
        return 10;
      case 2:
        return 25;
      case 3:
        return 50;
      case 4:
        return 75;
      case 5:
        return 125;
      case 6:
        return 200;
      default:
        return 0;
    }
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

  playersToString(players: Player[]) {
    let playerString = '';

    for (let player of players) {
      playerString = playerString + ', ' + player.name;
    }

    return playerString.substring(2);
  }

  private async awardPoint(player: Player, questionNumber: number) {
    const goal = player.gameScore + this.calculatePoints(questionNumber);
    while (player.gameScore < goal) {
      player.gameScore += 1;
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    player.gameScore = goal;
  }
}
