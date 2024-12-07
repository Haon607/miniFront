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
import { animate, style, transition, trigger } from "@angular/animations";
import { ColorFader } from "../../../utils";

@Component({
  selector: 'app-sound-sequence.round.game',
  standalone: true,
  imports: [ProgressBarComponent, ScoreboardComponent, TimerComponent, NgStyle],
  templateUrl: './sound-sequence.round.game.component.html',
  styleUrl: './sound-sequence.round.game.component.css',
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
export class SoundSequenceRoundGameComponent {
  game: Game = new Game();
  state = 'startup';
  playerAnswerProjection: {
    id: number,
    name: string,
    input: string,
    sequenceCorrect: boolean | undefined,
    color: string
  }[] = [];
  indexedSequence: number[][] = [];
  selectMusic = new Audio('/audio/rounds/sound-sequence/select.mp3');
  revealMusic = new Audio('/audio/rounds/sound-sequence/reveal.mp3')
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;
  @ViewChild(ProgressBarComponent) progressBarComponent!: ProgressBarComponent;
  protected readonly ColorFader = ColorFader;
  private advanceMusic = false;

  constructor(private gameService: GameReqService, private playerService: PlayerReqService, private memory: MemoryGameService, private router: Router, private route: ActivatedRoute, private squares: SquaresService, private scoreboard: ScoreboardService,) {
    gameService.getGame(memory.gameId).subscribe(game => {
      this.game = game;
      this.game.players.push(new Player(-1, Constants.GAMEOPTIONAME))
      this.testSound();
    });
    this.selectMusic.load()
    this.revealMusic.load()
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
    this.gameService.modifyData(this.memory.gameId, "/sound", 'select').subscribe(() => {
      this.timerComponent.startTimer()
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
    let finalRound = NaN;
    this.state = '';
    this.squares.setGradient('#281A26', '#1A6675', true, 100);
    await new Promise(resolve => setTimeout(resolve, 1500));
    for (let i = 1; i <= 10; i++) {
      this.state = 'setup'
      this.selectMusic.currentTime = 0
      this.advanceMusic = false;
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.timerComponent.resetTimer();
      this.progressBarComponent.modifyProgress(1);
      this.playerService.deleteInputs().subscribe(() => {
      });
      this.state = 'playing'
      await new Audio('/audio/whistle.mp3').play()
      await new Promise(resolve => setTimeout(resolve, 250));
      let sequence = this.generateSequence(i + Math.floor((i + 1) * 0.5))
      for (let j = 0; j < sequence.length; j++) {
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
      await new Audio('/audio/whistle.mp3').play()
      this.selectMusic.play();
      this.soundMonitor();
      this.revealMusic.currentTime = 0;
      this.revealMusic.volume = 1;
      this.sendSelectToPlayer()
      let everySecond = false;
      while (this.state === 'select') {
        this.gameService.getGame(this.memory.gameId).subscribe(game => {
          this.playerAnswerProjection = game.players.map(player => {
            return {
              id: player.id,
              name: player.name,
              input: player.input,
              sequenceCorrect: undefined,
              color: (everySecond || !this.isPlayerDone(player.id)) ? player.color : (ColorFader.getContrastColor(player.color) === '#FFFFFF' ? '#000000' : '#FFFFFF')
            }
          })
        })
        everySecond = !everySecond;

        this.squares.line(0, '#1A6675', 100, 1, 1, false)
        this.squares.line(9, '#281A26', 100, 1, 1, false, true)
        await new Promise(resolve => setTimeout(resolve, 250));

        let allDone = true;
        this.playerAnswerProjection.forEach(player => {
          if (!this.isPlayerDone(player.id)) allDone = false;
        })
        if (allDone) {
          this.state = 'done';
        }

        this.squares.line(0, '#281A26', 100, 1, 1, false)
        this.squares.line(9, '#1A6675', 100, 1, 1, false, true)
        await new Promise(resolve => setTimeout(resolve, 250));
      }

      this.gameService.modifyData(this.memory.gameId, "/sound", "reveal").subscribe(game => {
        this.playerAnswerProjection = game.players.map(player => {
          return {
            id: player.id,
            name: player.name,
            input: player.input,
            sequenceCorrect: undefined,
            color: player.color
          }
        })
      });
      this.timerComponent.stopTimer();
      this.timerComponent.modifyTimer(0);
      this.advanceMusic = true;
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.squares.setGradient('#281A26', '#1A6675', false, 100);
      let loopAgain;
      await this.revealFnct(i).then(anyCorrect => {
        loopAgain = anyCorrect;
      });
      finalRound = i;
      if (!loopAgain) {
        break;
      }
    }
    this.router.navigateByUrl("/game/scoreboard/" + Number(this.route.snapshot.paramMap.get('round')!))
  }

  onTimerEnd() {
    this.state = 'done';
  }

  playSound(reveal = false) {
    let sound = new Audio("/audio/rounds/sound-sequence/key" + String(Math.floor((Math.random() * 4) + 1)) + ".mp3");
    if (!reveal) {
      this.squares.colorEdges('#FFFFFF');
      sound.addEventListener('ended', () => {
        this.squares.colorEdges('#000000');
      })
    }
    sound.play();
    return sound;
  }

  idToPlayerName(id: string): string {
    if (id === '-1') {
      return Constants.GAMEOPTIONAME;
    }
    return this.memory.players.filter(player => player.id.toString() === id)[0]?.name ?? '';
  }

  async revealFnct(roundIndex: number): Promise<boolean> {
    let sequence = this.indexedSequence;
    this.indexedSequence = [];
    this.state = 'reveal';
    await new Promise(resolve => setTimeout(resolve, 2000));
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, Math.max(7500, sequence.length * 500) / sequence.length));
      this.indexedSequence.push(sequence[i]);
      new Audio('/audio/rounds/sound-sequence/reveal_sequence_element.mp3').play();
      this.playSound(true);
    }

    let gSeq = sequence.map(element => element[1].toString())
    let anyCorrect = false;
    for (let i = 0; i < this.playerAnswerProjection.length; i++) {
      let pSeq = this.playerAnswerProjection[i].input.split(';');
      if (pSeq[pSeq.length - 1] === 'done') {
        pSeq.pop();
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (gSeq.toString() === pSeq.toString()) {
        this.playerAnswerProjection[i].sequenceCorrect = true;
        let player = this.memory.players.filter(memoryPlayer => memoryPlayer.id === this.playerAnswerProjection[i].id)[0];
        player.gameScore += 1;
        player.correct = true;
        anyCorrect = true;
      } else {
        this.playerAnswerProjection[i].sequenceCorrect = false;
      }
    }
    let pointVar;
    if (roundIndex < 3) {
      pointVar = 1;
    } else if (roundIndex < 5) {
      pointVar = 2;
    } else if (roundIndex < 7) {
      pointVar = 3;
    } else {
      pointVar = 4;
    }
    new Audio('/audio/points_' + pointVar + '.mp3').play();
    await new Promise(resolve => setTimeout(resolve, 2500));
    this.scoreboard.sortSubject.next();
    await new Promise(resolve => setTimeout(resolve, Math.min(2000, 250 * sequence.length)));
    this.squares.setGradient('#281A26', '#1A6675', true, 100);
    for (let i = 10; i > 0; i--) {
      this.revealMusic.volume = i / 10;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.revealMusic.pause()
    this.revealMusic.currentTime = 0;
    this.revealMusic.volume = 1;
    if (!anyCorrect) {
      let celebVar;
      if (roundIndex < 3) {
        celebVar = 1;
      } else if (roundIndex < 5) {
        celebVar = 2;
      } else if (roundIndex < 7) {
        celebVar = 3;
      } else {
        celebVar = 4;
      }
      await new Audio('/audio/celebration_' + celebVar + '.mp3').play();
    }
    return anyCorrect;
  }

  isPlayerDone(playerId: number): boolean {
    let playerInput = this.playerAnswerProjection.filter(player => player.id === playerId)[0].input;
    if (playerInput.split(';')) {
      return playerInput.split(';')[playerInput.split(';').length - 1] === 'done'
    }
    return false;
  }

  idToPlayerColor(id: string) {
    if (id === '-1') {
      return '#000000';
    }
    return this.memory.players.filter(player => player.id.toString() === id)[0]?.color ?? '';
  }

  private async soundMonitor() {
    while (!this.advanceMusic) {
      await new Promise(resolve => setTimeout(resolve, 2901));
    }
    this.revealMusic.play();
    this.selectMusic.pause();
  }
}
