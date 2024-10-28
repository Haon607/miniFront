import { Component } from '@angular/core';
import { SquaresService } from "../../squares/squares.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { GameReqService } from "../../service/request/game.req.service";
import { Game } from "../../models";
import { RandomText } from "../../utils";
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-select.game',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './select.game.component.html',
  styleUrl: './select.game.component.css'
})
export class SelectGameComponent {
  selectMusic = new Audio();
  roundNumber = '';
  roundName = '#######'
  game: Game = new Game();
  size = 250;
  color = '#FFFFFF'

  constructor(
    private squares: SquaresService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private memory: MemoryGameService,
    private gameService: GameReqService,
  ) {
    this.roundNumber = activatedRoute.snapshot.paramMap.get('round')!;

    gameService.modifyData(memory.gameId, '/selectgame').subscribe(game => {
      this.game = game;
    });

    switch (this.roundNumber) {
      case "1":
        this.selectMusic.src = '/audio/select_first.mp3';
        this.startFirstAnimation();
        break;
      case this.memory.rounds.toString():
        this.selectMusic.src = '/audio/select_last.mp3';
        break;
      default:
        this.selectMusic.src = '/audio/select_game.mp3';
        break;
    }
    this.selectMusic.play();
  }

  skipToNext() {
    this.selectMusic.pause();
    this.selectMusic.currentTime = 0;
    this.router.navigateByUrl(`/game/round/${this.roundNumber}`)
  }

  private async startFirstAnimation() {
    this.squares.allFade('#000000', 250)
    await new Promise(resolve => setTimeout(resolve, 250));
    this.startLines();
    for (; this.size > 25; this.size -= 1) {
      if (this.size % 4 === 0 && this.size <= 100) {
        this.roundName = RandomText.generateRandomText(this.game.rounds[0].name.length)
        new Audio("/audio/select_roulette_tick.mp3").play();
      }
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    this.size = 0;
    new Audio("/audio/selected.mp3").play();
    this.roundName = this.game.rounds[0].name;
  }

  private async startLines() {
    let lineNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 10; i++) { //TODO TIME THIS WITH
      //TODO ROULETTE
      let color = this.game.players[i % this.game.players.length].color;
      for (let j = 0; j < 10; j++) {
        this.squares.line(lineNumber[j], color, 250, 10, 1, false);
        await new Promise(resolve => setTimeout(resolve, 100));
        // if (lineNumber[j] === 3 || lineNumber[j] === 5 || lineNumber[j] === 6) {
        //   new ColorFader().fadeColor(this.color, new ColorFader().getContrastColor(color), 250, col => this.color = col);
        // }
      }
      lineNumber = this.squares.shuffleArray(lineNumber)
    }
    this.selectMusic.pause()
    new Audio("/audio/transition_to_rules.mp3").play();
    lineNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse();
    for (let j = 0; j < 10; j++) {
      this.squares.line(lineNumber[j], '#000000', 250, 10, 1, false);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.router.navigateByUrl("/game/rules/1")
  }
}
