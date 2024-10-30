import { Component } from '@angular/core';
import { SquaresService } from "../../squares/squares.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { GameReqService } from "../../service/request/game.req.service";
import { Game } from "../../models";
import { ColorFader, RandomText } from "../../utils";
import { NgStyle } from "@angular/common";
import {colors} from "@angular/cli/src/utilities/color";

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
  maxsize = 250;
  fontColor = '#FFFFFF'
  preRoundText: string = '';

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
        this.startSmallAnimation(true);
        break;
      case this.memory.rounds.toString():
        // this.selectMusic.src = '/audio/select_last.mp3'; //TODO THIS SHOULD JUST BE A STINGER
        this.preRoundText = "LETZTE "
        this.maxsize -= 50;
        this.notFirstRound();
        break
      default:
        this.notFirstRound();
        break;
    }
    this.selectMusic.play();
  }

  private notFirstRound() {
    if (this.game.rounds[Number(this.roundNumber) - 1].large) {
      this.selectMusic.src = '/audio/select_large.mp3';
      this.preRoundText += "GROSSE "
      this.maxsize -= 50;
      this.startLargeAnimation();
    } else {
      this.selectMusic.src = '/audio/select_small.mp3';
      this.startSmallAnimation();
    }
  }

  private async startSmallAnimation(first = false) {
    this.startLines(!first, false, !first);
    for (; this.size > 0; this.size -= 1) {
      if (this.size % 4 === 0 && this.size <= 100) {
        this.roundName = RandomText.generateRandomText(this.game.rounds[Number(this.roundNumber)-1].name.length)
        new Audio("/audio/select_roulette_tick.mp3").play();
      }
      if (this.size > 25 && !first) {
        this.size -= 4;
      }
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    this.size = 0;
    new Audio("/audio/selected.mp3").play();
    this.roundName = this.game.rounds[Number(this.roundNumber)-1].name;
  }

  private async startLargeAnimation() {
    this.startLines(true, true);
    for (; this.size > 0; this.size -= 1) {
      if (this.size % 4 === 0 && this.size <= 200) {
        this.roundName = RandomText.generateRandomText(this.game.rounds[Number(this.roundNumber)-1].name.length)
        new Audio("/audio/select_roulette_tick.mp3").play(); //TODO Other sound?
      }
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    this.size = 0;
    new Audio("/audio/selected_large.mp3").play();
    this.roundName = this.game.rounds[Number(this.roundNumber)-1].name;
  }

  private async startLines(alt = false, vertical = false, faster = false) {
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

    let colors = this.game.players.map(player => player.color);

    for (let i = 0; i < (faster ? 5 : 10); i++) {
      let color;
      if (colors.length > 1) {
        color = colors[i % colors.length];
      } else {
        let colorList = [colors[0], ColorFader.adjustBrightness(colors[0], 10), ColorFader.adjustBrightness(colors[0], -10)];
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
    if (!vertical) {
      this.selectMusic.pause()
    } else {
      this.memory.music = this.selectMusic;
    }
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

  min(a: number, b: number): number {
    return a < b ? a : b;
  }
}
