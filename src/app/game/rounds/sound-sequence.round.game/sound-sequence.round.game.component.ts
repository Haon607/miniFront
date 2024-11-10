import { Component, ViewChild } from '@angular/core';
import { GameReqService } from "../../../service/request/game.req.service";
import { PlayerReqService } from "../../../service/request/player.req.service";
import { MemoryGameService } from "../../../service/memory/memory.game.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SquaresService } from "../../../squares/squares.service";
import { ScoreboardService } from "../../../scoreboard/scoreboard.service";
import { Game } from "../../../models";
import { TimerComponent } from "../../../timer/timer.component";
import { ProgressBarComponent } from "../../../progress-bar/progress-bar.component";
import { ScoreboardComponent } from "../../../scoreboard/scoreboard.component";

@Component({
  selector: 'app-sound-sequence.round.game',
  standalone: true,
  imports: [
    ProgressBarComponent,
    ScoreboardComponent,
    TimerComponent
  ],
  templateUrl: './sound-sequence.round.game.component.html',
  styleUrl: './sound-sequence.round.game.component.css'
})
export class SoundSequenceRoundGameComponent {
  game: Game = new Game();
  state = 'startup';
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;
  @ViewChild(ProgressBarComponent) progressBarComponent!: ProgressBarComponent;
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
      this.testSound();
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

  testSound() {
    this.state = 'test';
    this.gameService.modifyData(this.memory.gameId, "/sound", "test").subscribe(() => {});
  }

  sendSoundToPlayer(playerId: number) {
    this.gameService.modifyData(this.memory.gameId, "/sound", String(playerId)).subscribe(() => {})
  }

  sendSelectToPlayer() {
    this.playerService.deleteInputs().subscribe(() => {
      this.gameService.modifyData(this.memory.gameId, "/sound", 'select').subscribe(() => {})
    })
  }

  generateSequence(length: number) {
    let possible = this.game.players.map(player => player.id);
    possible.push(-1);
    let sequence: number[] = [];
    for (let i = 0; i < length; i++) {
      sequence.push(possible[Math.floor(Math.random() * possible.length)]);
    }
    return sequence;
  }

  async startRound() {
    this.state = '';
    for (let i = 1; i <= 10; i++) {
      this.timerComponent.resetTimer();
      this.progressBarComponent.modifyProgress(1);
      this.state = 'playing'
      let sequence = this.generateSequence(i + Math.floor((i+1)*0.5))
      for (let j = 0; j < sequence.length; j++) {
        if (sequence[j] === -1) {

        } else {
          this.sendSoundToPlayer(sequence[i]);
          await new Promise(resolve => setTimeout(resolve, 500));
          let done = false;
          while (!done) {
            await new Promise(resolve => setTimeout(resolve, 100));
            this.gameService.getGame(this.memory.gameId).subscribe(game => {
              if (game.data === '') {
                done = true;
              }
            })
          }
        }
      }
      this.state = 'select'
      this.gameService.modifyData(this.memory.gameId, '/sounds', 'select').subscribe(() => {
        this.timerComponent.startTimer();
      })
      while (this.state === 'select') {
        await new Promise(resolve => setTimeout(resolve, 100));

      }
    }
  }
  onTimerEnd() {
    this.state = 'done';
  }
}
