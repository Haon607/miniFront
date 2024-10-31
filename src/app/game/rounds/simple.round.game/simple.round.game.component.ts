import { Component } from '@angular/core';
import { ScoreboardComponent } from "../../../scoreboard/scoreboard.component";
import { GameReqService } from "../../../service/request/game.req.service";
import { MemoryGameService } from "../../../service/memory/memory.game.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Answer, Game, Player, Question, Round } from "../../../models";
import { SquaresService } from "../../../squares/squares.service";
import { ColorFader } from "../../../utils";
import { NgStyle } from "@angular/common";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-simple.round.game',
  standalone: true,
  imports: [
    ScoreboardComponent,
    NgStyle
  ],
  templateUrl: './simple.round.game.component.html',
  styleUrl: './simple.round.game.component.css',
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
/**
 * This component is for 5 questions to the trivial pursuit categories,
 * the question data looks as follows:
 * QUESTION§CORRECTANSWER;OPTION1;OPTION2;OPTION3
 */
export class SimpleRoundGameComponent {
  game: Game = new Game();
  round: Round = new Round();
  more = new Audio('/audio/rounds/simple/simple_more.mp3');
  less = new Audio('/audio/rounds/simple/simple_less.mp3');
  question: string = '';
  answers: Answer[] = [];
  backgroundMore: boolean | undefined = undefined;

  constructor(
    private gameService: GameReqService,
    private memory: MemoryGameService,
    private router: Router,
    private route: ActivatedRoute,
    private squares: SquaresService,
  ) {
    gameService.getGame(memory.gameId).subscribe(game => {
      this.game = game;
      this.round = game.rounds[Number(route.snapshot.paramMap.get('round')!) - 1];
      this.startRound();
    });

    this.round = new Round(
      0, "", "", "", false, [
        new Question(0, "Test§1;2;3;4"),
        new Question(1, "Test§1;2;3;4"),
        new Question(2, "Test§1;2;3;4"),
        new Question(3, "Test§1;2;3;4"),
        new Question(4, "Test§1;2;3;4"),
        new Question(5, "Test§1;2;3;4"),
      ], '#4fa626'
    )
  }

  async startRound() {
    this.round.questions = this.squares.shuffleArray(this.round.questions);
    this.round.questions = this.round.questions.slice(0, 5);

    await this.animateIntro();

    for (let question of this.round.questions) {
      this.question = question.data.split('§')[0];
      this.answers = question.data.split('§')[1].split(';').map(text => new Answer(NaN, text));
      this.answers = this.answers.map(answer => {
        answer.color = '#FFFFFF';
        return answer;
      })
      this.answers[0].isCorrect = true;
      this.answers = this.squares.shuffleArray(this.answers)
      this.toggleAudioTrack(false);
      this.gameService.modifyData(this.memory.gameId, "/select",  this.answers.join(';')).subscribe(() => {})
    }
  }

  protected async animateIntro() {
    this.toggleAudioTrack(true)
    this.more.play();
    this.less.play();
    this.squares.allLine(this.round.data, 90, 1, 1, false, true)
    await new Promise(resolve => setTimeout(resolve, 900));
    this.squares.setGradient(ColorFader.adjustBrightness(this.round.data, 10), ColorFader.adjustBrightness(this.round.data, -10), false, 50);
    await new Promise(resolve => setTimeout(resolve, 500));
    this.backgroundMore = true;
    this.beginBackground();
  }

  protected toggleAudioTrack(more: boolean): void {
    const fadeDuration = 100; // duration of the fade in milliseconds
    const fadeInterval = 10;  // interval time for each volume adjustment in milliseconds
    const steps = fadeDuration / fadeInterval;
    let step = 0;

    if (more) {
      const fadeInMore = setInterval(() => {
        this.more.volume = Math.min(1, step / steps);
        this.less.volume = Math.max(0, 1 - step / steps);
        step++;

        if (step >= steps) clearInterval(fadeInMore);
      }, fadeInterval);
      this.backgroundMore = true;
    } else {
      const fadeOutMore = setInterval(() => {
        this.more.volume = Math.max(0, 1 - step / steps);
        this.less.volume = Math.min(1, step / steps);
        step++;

        if (step >= steps) clearInterval(fadeOutMore);
      }, fadeInterval);
      this.backgroundMore = false;
    }
  }

  protected playersToString(players: Player[]) {
    let playerString = '';

    for (let player of players) {
      playerString = playerString + ', ' + player.name;
    }

    return playerString.substring(2);
  }

  private async beginBackground() {
    let bool = false;
    while (this.backgroundMore !== undefined) {
      bool = !bool
      if (!this.backgroundMore) {
        this.squares.line(0, ColorFader.adjustBrightness(this.round.data, bool ? 10 : -10), 1, 1, 1, false, false)
        this.squares.line(9, ColorFader.adjustBrightness(this.round.data, bool ? 10 : -10), 1, 1, 1, false, true)
      } else {
        //TODO find better animation
        this.squares.setGradient(ColorFader.adjustBrightness(this.round.data, 10), ColorFader.adjustBrightness(this.round.data, -10), bool, 40);
      }
      await new Promise(resolve => setTimeout(resolve, 434));
    }
  }
}
