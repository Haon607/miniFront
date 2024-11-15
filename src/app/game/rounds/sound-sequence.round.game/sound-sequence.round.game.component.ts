import { Component, ViewChild } from '@angular/core';
import { GameReqService } from "../../../service/request/game.req.service";
import { PlayerReqService } from "../../../service/request/player.req.service";
import { MemoryGameService } from "../../../service/memory/memory.game.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SquaresService } from "../../../squares/squares.service";
import { ScoreboardService } from "../../../scoreboard/scoreboard.service";
import { Game, Player } from "../../../models";
import { TimerComponent } from "../../../timer/timer.component";
import { ProgressBarComponent } from "../../../progress-bar/progress-bar.component";
import { ScoreboardComponent } from "../../../scoreboard/scoreboard.component";
import { Constants } from "../../../constants";
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-sound-sequence.round.game',
  standalone: true,
  imports: [
    ProgressBarComponent,
    ScoreboardComponent,
    TimerComponent,
    NgStyle
  ],
  templateUrl: './sound-sequence.round.game.component.html',
  styleUrl: './sound-sequence.round.game.component.css'
})
export class SoundSequenceRoundGameComponent {
  game: Game = new Game();
  state = 'startup';
  playerAnswerProjection: {id: number, name: string, input: string, sequenceCorrect: boolean}[] = [];
  indexedSequence: number[][] = [];
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
      this.game.players.push(new Player(-1, Constants.GAMEOPTIONAME))
      this.testSound();
    });
    this.initScoreboard();
    this.squares.setGradient('#281A26', '#1A6675', true, 100);
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
    this.gameService.modifyData(this.memory.gameId, "/sound", "test").subscribe(() => {
    });
  }

  sendSoundToPlayer(playerId: number) {
    this.gameService.modifyData(this.memory.gameId, "/sound", String(playerId)).subscribe(() => {
    })
  }

  sendSelectToPlayer() {
    this.playerService.deleteInputs().subscribe(() => {
      this.gameService.modifyData(this.memory.gameId, "/sound", 'select').subscribe(() => {
        this.timerComponent.startTimer()
      })
    })
  }

  generateSequence(length: number) {
    let possible = this.game.players.map(player => player.id);
    let sequence: number[] = [];
    for (let i = 0; i < length; i++) {
      sequence.push(possible[Math.floor(Math.random() * possible.length)]);
    }
    return sequence;
  }

  async startRound() {
    this.state = '';
    await new Promise(resolve => setTimeout(resolve, 500));
    for (let i = 1; i <= 10; i++) {
      this.squares.setGradient('#281A26', '#1A6675', true, 100);
      this.timerComponent.resetTimer();
      this.progressBarComponent.modifyProgress(1);
      this.state = 'playing'
      let sequence = this.generateSequence(i + Math.floor((i + 1) * 0.5))
      console.log(sequence) //TODO DEBUG
      for (let j = 0; j < sequence.length; j++) {
        console.log(sequence[j]) //TODO DEBUG
        if (sequence[j] === -1) {
          let done = false;
          this.playSound().addEventListener('ended', () => {
            done = true;
          })
          while (!done) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } else {
          this.sendSoundToPlayer(sequence[j]);
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
      this.indexedSequence = [];
      for (let j = 0; j < sequence.length; j++) {
        this.indexedSequence.push([j, sequence[j]]);
      }
      this.state = 'select'
      this.sendSelectToPlayer()
      while (this.state === 'select') {
        this.squares.fadeSquares(this.squares.checkerPath, '#281A26', 400)
        await new Promise(resolve => setTimeout(resolve, 250));
        this.squares.fadeSquares(this.squares.checkerPathInv, '#281A26', 400)
        await new Promise(resolve => setTimeout(resolve, 250));
        this.squares.fadeSquares(this.squares.checkerPath, '#1A6675', 400)
        await new Promise(resolve => setTimeout(resolve, 250));
        this.squares.fadeSquares(this.squares.checkerPathInv, '#1A6675', 400)
        await new Promise(resolve => setTimeout(resolve, 250));
        this.gameService.getGame(this.memory.gameId).subscribe(game => {
          this.playerAnswerProjection = [];
          for (let player of game.players) {
            this.playerAnswerProjection.push(
              {
                id: player.id,
                name: player.name,
                input: player.input,
                sequenceCorrect: false
              }
              );
          }
        })
      }
      this.timerComponent.stopTimer();
      await new Promise(resolve => setTimeout(resolve, 500));

      this.state = 'reveal';
      this.squares.setGradient('#281A26', '#1A6675', false, 100);
      await this.reveal();
    }
  }

  onTimerEnd() {
    this.state = 'done';
  }

  playSound() {
    let sound = new Audio("/audio/rounds/sound-sequence/key" + String(Math.floor((Math.random() * 4) + 1)) + ".mp3");
    this.squares.colorEdges('#FFFFFF');
    sound.addEventListener('ended', () => {
      this.squares.colorEdges('#000000');
    })
    sound.play();
    return sound;
  }

  idToPlayerName(id: string): string {
    if (id === '-1') {
      return Constants.GAMEOPTIONAME;
    }
    return this.memory.players.filter(player => player.id.toString() === id)[0]?.name ?? '';
  }

  private async reveal() {

    while (this.state === 'reveal') {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}
