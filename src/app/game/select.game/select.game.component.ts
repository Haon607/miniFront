import { Component } from '@angular/core';
import { SquaresService } from "../../squares/squares.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { GameReqService } from "../../service/request/game.req.service";
import { Game } from "../../models";
import { ColorFader, RandomText } from "../../utils";
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
  fontColor = '#FFFFFF'

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

    this.startSequence();
  }

  private async startSequence() {
    this.squares.allFade('#000000', 50)
    await new Promise(resolve => setTimeout(resolve, 250));

    switch (this.roundNumber) {
      case "1":
        this.selectMusic.src = '/audio/select_first.mp3';
        this.startFirstAnimation();
        break;
      case this.memory.rounds.toString():
        this.selectMusic.src = '/audio/select_last.mp3'; //TODO THIS SHOULD JUST BE A STINGER
        break;
      default:
        if (this.game.rounds[Number(this.roundNumber)-1].large) {
          this.selectMusic.src = '/audio/select_large.mp3'; //TODO animation should go up i think and theme should be duell and animation could be longer
          this.startLargeAnimation();
        } else {
          this.selectMusic.src = '/audio/select_small.mp3';
          this.startSmallAnimation();
        }
        break;
    }
    this.selectMusic.play();
  }

  private async startFirstAnimation() {
    this.startLines();
    await this.startAnimation();
  }

  private async startSmallAnimation() {
    this.startLines(true);
    await this.startAnimation();
  }

  private async startLargeAnimation() {
    this.startLines(true, true);
    await this.startLargeAnimation();
  }

  private async startAnimation() {
    for (; this.size > 25; this.size -= 1) {
      if (this.size % 4 === 0 && this.size <= 100) {
        this.roundName = RandomText.generateRandomText(this.game.rounds[Number(this.roundNumber)-1].name.length)
        new Audio("/audio/select_roulette_tick.mp3").play(); //TODO MAYBE CHANGE THIS
      }
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    this.size = 0;
    new Audio("/audio/selected.mp3").play(); //TODO CHANGE THIS SOUND
    this.roundName = this.game.rounds[Number(this.roundNumber)-1].name;
  }

  private async startLines(alt = false, vertical = false) {
    let lineNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let contrastColorsArray: string[] = [];
    for (let j = 0; j < this.game.players.length; j++) {
      contrastColorsArray.push(ColorFader.getContrastColor(this.game.players[j].color));
    }
    let blackray: string[] = contrastColorsArray.filter(x => x === '#000000');
    let whiteray: string[] = contrastColorsArray.filter(x => x === '#FFFFFF');
    if (blackray.length > whiteray.length) {
      this.fontColor = '#000000';
    } else if (blackray.length < whiteray.length) {
      this.fontColor = '#FFFFFF';
    } else {
      this.fontColor = '#FFFFFF';
    }

    for (let i = 0; i < 10; i++) {
      let color;
      if (this.game.players.length > 1) {
        color = this.game.players[i % this.game.players.length].color;
      } else {
        let colorList = [this.game.players[0].color, new ColorFader().adjustBrightness(this.game.players[0].color, 10), new ColorFader().adjustBrightness(this.game.players[0].color, -10)];
        color = colorList[i % colorList.length];
      }
      for (let j = 0; j < 10; j++) {
        if (vertical) {
          this.squares.verticalLine(lineNumber[j], color, 250, 10, 1, false, alt);
        } else {
          this.squares.line(lineNumber[j], color, 250, 10, 1, false, alt);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      lineNumber = this.squares.shuffleArray(lineNumber)
    }
    this.selectMusic.pause()
    new Audio("/audio/transition_to_rules.mp3").play();
    lineNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse();
    for (let j = 0; j < 10; j++) {
      if (vertical) {
        this.squares.verticalLine(lineNumber[j], '#000000', 250, 10, 1, false, alt);
      } else {
        this.squares.line(lineNumber[j], '#000000', 250, 10, 1, false, alt);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.router.navigateByUrl("/game/rules/" + this.roundNumber);
  }
}
