import { Component, ViewChild } from '@angular/core';
import { ProgressBarComponent } from "../../../progress-bar/progress-bar.component";
import { ScoreboardComponent } from "../../../scoreboard/scoreboard.component";
import { TimerComponent } from "../../../timer/timer.component";
import { GameReqService } from "../../../service/request/game.req.service";
import { PlayerReqService } from "../../../service/request/player.req.service";
import { MemoryGameService } from "../../../service/memory/memory.game.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SquaresService } from "../../../squares/squares.service";
import { ScoreboardService } from "../../../scoreboard/scoreboard.service";
import { Game, Round } from "../../../models";
import { animate, style, transition, trigger } from "@angular/animations";
import { NgStyle } from "@angular/common";
import { ColorFader } from "../../../utils";

@Component({
  selector: 'app-dash.round.game',
  standalone: true,
  imports: [
    ProgressBarComponent,
    ScoreboardComponent,
    TimerComponent,
    NgStyle
  ],
  templateUrl: './dash.round.game.component.html',
  styleUrl: './dash.round.game.component.css',
  animations: [trigger('slide', [transition('void => *', [style({
    position: "relative", right: "-1300px",
  }), animate('250ms ease-out', style({
    right: "0"
  })),]), transition('* => void', [style({
    position: "relative", left: "0"
  }), animate('250ms ease-in', style({
    left: "-1300px"
  }))])])]
})
export class DashRoundGameComponent {
  game: Game = new Game();
  round: Round = new Round();
  display: {
    title: string,
    definition: string,
    countdown: string,
    elementsLeft: number,
    elements: string[];
    table: boolean;
    tableElements: string[];
    incorrectAnswers: string[];
  } = {
    title: '',
    definition: '',
    countdown: '',
    elements: [],
    elementsLeft: NaN,
    table: false,
    tableElements: [],
    incorrectAnswers: []
  };
  list: {
    title: string,
    definition: string,
    elements: string[];
  } = {title: '', definition: '', elements: []};
  playerAnswers: {
    id: number,
    name: string,
    color: string,
    validAnswers: string[]
  }[] = [];
  timeSize: number = 0;
  stopListIntroAnim = false;
  stopGameStartAnim = false;
  stopGameRunningAnim = false;
  music = new Audio();
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;
  protected readonly ColorFader = ColorFader;

  constructor(
    private gameService: GameReqService,
    private playerService: PlayerReqService,
    private memory: MemoryGameService,
    private router: Router,
    private route: ActivatedRoute,
    private squares: SquaresService,
    private scoreboard: ScoreboardService,
  ) {
    gameService.getGame(memory.gameId).subscribe(game => {
      this.game = game;
      this.round = game.rounds[Number(route.snapshot.paramMap.get('round')!) - 1];
      this.startRound();
    });
    this.initScoreboard();
  }

  async initScoreboard() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.scoreboard.playerSubject.next(this.memory.players);
    this.scoreboard.totalSubject.next(false);
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.scoreboard.sortSubject.next();
  }

  async startRound() {
    this.round.questions = this.squares.shuffleArray(this.round.questions);
    this.round.questions = this.round.questions.slice(0, 1);
    this.list = {
      title: this.round.questions[0].data.split('§')[0],
      definition: this.round.questions[0].data.split('§')[1],
      elements: this.round.questions[0].data.split('§')[2].split(';'),
    };
    this.music = new Audio('/audio/rounds/dash/dash_intro.mp3');
    this.music.addEventListener('ended', () => {
      this.startGame();
    });
    this.music.play();
    await this.playStartAnimation();
    this.stopListIntroAnim = false;
    this.startBlinks();
    this.display.title = this.list.title;
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.display.definition = this.list.definition;
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.display.elementsLeft = 0;
    for (let element of this.list.elements) {
      this.display.elementsLeft++;
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  onTimerEnd() {

  }

  async startGame() {
    this.showResults();
    this.music.pause();
    this.music = new Audio('/audio/rounds/dash/dash_play.mp3');
    this.music.play()
    this.stopListIntroAnim = true;
    this.display.definition = '';
    this.display.countdown = "ACHTUNG"
    this.startGameAnimation();
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 25));
      this.timeSize += 5
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.display.countdown = "3"
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.display.countdown = "2"
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.display.countdown = "1"
    await new Promise(resolve => setTimeout(resolve, 750));
    this.stopGameStartAnim = true;
    await new Promise(resolve => setTimeout(resolve, 250));
    this.display.countdown = "LOS"
    this.timerComponent.startTimer()
    this.playerService.deleteInputs().subscribe(() => {
    })
    this.gameService.modifyData(this.memory.gameId, "/dash", this.list.title).subscribe(() => {
    })
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.display.countdown = ""
    this.gameRunningAnimation();

  }

  getCurrentDisplayedAnswers(answers: string[]): { 'value': string, 'key': number }[] {
    let displayedAnswers: string[] = [];
    for (let tableElement of this.display.tableElements) {
      displayedAnswers.push(answers.filter(pAnswers => this.compareAnswer(pAnswers, tableElement)).join(' & '))
    }
    let returnedDisplayedAnswers: { 'value': string, 'key': number }[] = [];
    for (let i = 0; i < displayedAnswers.length; i++) {
      returnedDisplayedAnswers.push({'value': displayedAnswers[i], 'key': i});
    }
    return returnedDisplayedAnswers;
  }

  private async playStartAnimation() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.squares.verticalLine(3, '#feca35', 500, 10, 1, true)
    this.squares.verticalLine(4, '#feca35', 500, 10, 1, true)
    this.squares.verticalLine(5, '#feca35', 500, 10, 1, true)
    this.squares.verticalLine(6, '#feca35', 500, 10, 1, true)
    await new Promise(resolve => setTimeout(resolve, 500));
    this.squares.verticalLine(0, '#268168', 1000, 10, 1, false, true)
    this.squares.verticalLine(1, '#268168', 1000, 10, 1, false, true)
    this.squares.verticalLine(8, '#268168', 1000, 10, 1, false, true)
    this.squares.verticalLine(9, '#268168', 1000, 10, 1, false, true)
    await new Promise(resolve => setTimeout(resolve, 1350));
    const coords = [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 3], [1, 4], [1, 5], [1, 6], [2, 3], [2, 4], [2, 5], [2, 6], [3, 3], [3, 4], [3, 5], [3, 6], [4, 3], [4, 4], [4, 5], [4, 6], [5, 3], [5, 4], [5, 5], [5, 6], [6, 3], [6, 4], [6, 5], [6, 6], [7, 3], [7, 4], [7, 5], [7, 6], [8, 3], [8, 4], [8, 5], [8, 6], [9, 3], [9, 4], [9, 5], [9, 6]];
    this.squares.colorSquares(coords, '#175564')
    await new Promise(resolve => setTimeout(resolve, 100));
    this.squares.colorSquares(coords, '#5a3735')
    await new Promise(resolve => setTimeout(resolve, 200));
    this.squares.colorSquares(coords, '#173a46')
    await new Promise(resolve => setTimeout(resolve, 150));
    this.squares.colorSquares(coords, '#3b202a')
    await new Promise(resolve => setTimeout(resolve, 100));
    this.squares.allFade('#191725', 500)
    await new Promise(resolve => setTimeout(resolve, 850));
    this.squares.all('#175564')
    this.squares.allFade('#142b45', 1000)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async startBlinks() {
    let seq = this.squares.shuffleArray(this.squares.allPath);
    for (let i = 0; !this.stopListIntroAnim; i++) {
      this.squares.colorSquares([seq[i % 100]], '#268168')
      this.squares.fadeSquares([seq[i % 100]], '#142b45', 1000)
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async showResults() {
    // await new Promise(resolve => setTimeout(resolve, 67500));
    // //LastMinute
    // await new Promise(resolve => setTimeout(resolve, 60000));
    await new Promise(resolve => setTimeout(resolve, 10000));
    this.timerComponent.modifyTimer(13)
    this.music.currentTime = 115.5;
    await new Promise(resolve => setTimeout(resolve, 12000));

    this.stopGameRunningAnim = true
//timer aus
    this.gameService.modifyData(this.memory.gameId, '/idle').subscribe(game => {
      this.playerAnswers = game.players.map(player => {
        return {
          id: player.id,
          name: player.name,
          color: player.color,
          validAnswers: player.input.split(';').filter(answer => Boolean(this.isAnswerAnywhereValid(answer, this.list.elements)))
        }
      })
    })
    await new Promise(resolve => setTimeout(resolve, 2916));
//Rise start
    this.shrinkTimer();
    await new Promise(resolve => setTimeout(resolve, 840));
//bumm start
    await new Promise(resolve => setTimeout(resolve, 3749));
//lines
    this.display.countdown = "ENDE!"
    this.middleLinesDashArrow();
    await new Promise(resolve => setTimeout(resolve, 7506));
//start showing table
    this.display.countdown = "";
    this.display.table = true
    this.scrollTable();
    await new Promise(resolve => setTimeout(resolve, 22484));
//start showing wrong answers
    await new Promise(resolve => setTimeout(resolve, 13135));
//positive
    await new Promise(resolve => setTimeout(resolve, 1875));
//count up
    await new Promise(resolve => setTimeout(resolve, 3825));
//outklingen
  }

  private async shrinkTimer() {
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 12));
      this.timeSize -= 5
    }
  }

  private async middleLinesDashArrow() {
    for (let i = 0; i < 10; i++) {
      let color = i % 2 ? '#268168' : '#5a3735';
      this.squares.line(4, color, 500, 10, 1, true)
      this.squares.line(5, color, 500, 10, 1, true)
      await new Promise(resolve => setTimeout(resolve, 50));
      this.squares.line(3, color, 500, 10, 1, true)
      this.squares.line(6, color, 500, 10, 1, true)
      await new Promise(resolve => setTimeout(resolve, 50));
      this.squares.line(2, color, 500, 10, 1, true)
      this.squares.line(7, color, 500, 10, 1, true)
      await new Promise(resolve => setTimeout(resolve, 644));
    }
  }

  private async startGameAnimation() {
    while (!this.stopGameStartAnim) {
      this.squares.line(0, '#268168', 10, 1, 1, false)
      await new Promise(resolve => setTimeout(resolve, 25));
      this.squares.line(1, '#268168', 10, 1, 1, false)
      await new Promise(resolve => setTimeout(resolve, 25));
      this.squares.line(2, '#268168', 10, 1, 1, false)
      await new Promise(resolve => setTimeout(resolve, 50));
      this.squares.line(9, '#268168', 10, 1, 1, false, true)
      await new Promise(resolve => setTimeout(resolve, 25));
      this.squares.line(8, '#268168', 10, 1, 1, false, true)
      await new Promise(resolve => setTimeout(resolve, 25));
      this.squares.line(7, '#268168', 10, 1, 1, false, true)
      await new Promise(resolve => setTimeout(resolve, 50));
      this.squares.line(0, '#5a3735', 10, 1, 1, false)
      await new Promise(resolve => setTimeout(resolve, 25));
      this.squares.line(1, '#5a3735', 10, 1, 1, false)
      await new Promise(resolve => setTimeout(resolve, 25));
      this.squares.line(2, '#5a3735', 10, 1, 1, false)
      await new Promise(resolve => setTimeout(resolve, 50));
      this.squares.line(9, '#5a3735', 10, 1, 1, false, true)
      await new Promise(resolve => setTimeout(resolve, 25));
      this.squares.line(8, '#5a3735', 10, 1, 1, false, true)
      await new Promise(resolve => setTimeout(resolve, 25));
      this.squares.line(7, '#5a3735', 10, 1, 1, false, true)
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.squares.colorEdges('#FFFFFF')
    this.squares.allFade('#3b202a', 1000)
  }

  private async gameRunningAnimation() {
    let seq = this.squares.shuffleArray(this.squares.allPath);
    for (let i = 0; !this.stopGameRunningAnim; i++) {
      this.fadeInOut(seq[i % 100], i % 1.5 === 0);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async fadeInOut(coord: number[], blue: boolean) {
    this.squares.fadeSquares([coord], blue ? '#268168' : '#5a3735', 1000)
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.squares.fadeSquares([coord], blue ? '#142b45' : '#3b202a', 1000)
  }

  private async scrollTable() {
    let foundAnswers = this.findFoundAnswers();
    foundAnswers = foundAnswers.sort((a, b) => a.localeCompare(b))

    if (foundAnswers.length >= 7) this.display.tableElements = [foundAnswers[0], foundAnswers[1], foundAnswers[2], foundAnswers[3], foundAnswers[4], foundAnswers[5], foundAnswers[6]];

    for (let i = 8; i < foundAnswers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20000 / foundAnswers.length));
      this.display.tableElements[i%7] = foundAnswers[i];
    }
  }

  private isAnswerAnywhereValid(input: string, list: string[], returnActual = false) {
    for (let element of list) {
      if (this.compareAnswer(input, element)) return returnActual ? element : true;
    }
    if (!this.display.incorrectAnswers.includes(input)) this.display.incorrectAnswers.push(input);
    return false;
  }

  private compareAnswer(input: string, actualAnswer: string): string {
    let errorQuota = 0.25

    // Calculate the maximum number of allowable differences (always round up to allow at least one error)
    const maxErrors = Math.ceil(actualAnswer.length * errorQuota);

    // Initialize pointers and error count
    let errorCount = 0;
    let i = 0, j = 0;

    // Use two pointers to compare characters allowing for missing letters
    while (i < input.length && j < actualAnswer.length) {
      if (input[i] !== actualAnswer[j]) {
        errorCount++;
        if (errorCount > maxErrors) {
          return "";
        }
        j++; // Assume a missing character in the input
      } else {
        i++;
        j++;
      }
    }

    // Account for remaining characters in either string
    errorCount += (actualAnswer.length - j) + (input.length - i);

    return errorCount <= maxErrors ? input : "";
  }

  private findFoundAnswers(): string[] {
    let allElements = this.list.elements;
    let allPlayerAnswers: string[] = [];
    this.playerAnswers.forEach(player => player.validAnswers.forEach(answer => {
      if (!allPlayerAnswers.includes(answer)) allPlayerAnswers.push(answer);
    }))
    let foundElements: string[] = allPlayerAnswers.map(answer => String(this.isAnswerAnywhereValid(answer, allElements, true)));
    return [...new Set(foundElements)];
  }
}
