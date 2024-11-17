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
    this.fontColor = '#000000'
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (this.roundNumber) {
      case "1":
        this.selectMusic.src = '/audio/select_first.mp3';
        this.startSmallAnimation(true);
        break;
      case this.memory.rounds.toString():
        this.preRoundText = "LETZTE "
        this.maxsize -= 50;
        await this.lastRoundStinger();
        this.notFirstRound(true);
        break
      default:
        this.notFirstRound();
        break;
    }
    this.selectMusic.play();
  }

  private async notFirstRound(last = false) {
    if (this.game.rounds[Number(this.roundNumber) - 1].large) {
      this.preRoundText += "GROSSE "
      this.maxsize -= 50;
      await this.largeRoundStinger();
      this.selectMusic.src = '/audio/select_large.mp3';
      this.startLargeAnimation();
    } else {
      this.selectMusic.src = last ? '/audio/select/select_last.mp3' : '/audio/select_small.mp3';
      this.startSmallAnimation(false, last);
    }
  }

  private async startSmallAnimation(first = false, last = false) {
    const faster = !first && !last;
    this.startLines(!first, false, faster, last);

    for (; this.size > 0; this.size -= 1) {
      if (this.size % 4 === 0 && this.size <= 100) {
        this.roundName = RandomText.generateRandomText(this.game.rounds[Number(this.roundNumber) - 1].name);
        new Audio("/audio/select_roulette_tick.mp3").play();
      }
      if (this.size > 25 && !first) {
        this.size -= 4;
      }
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    this.size = 0;
    new Audio("/audio/selected.mp3").play();
    this.roundName = this.game.rounds[Number(this.roundNumber) - 1].name;
  }

  private async startLargeAnimation() {
    this.startLines(true, true);
    for (; this.size > 0; this.size -= 1) {
      if (this.size % 4 === 0 && this.size <= 200) {
        this.roundName = RandomText.generateRandomText(this.game.rounds[Number(this.roundNumber)-1].name)
        new Audio("/audio/select_roulette_tick.mp3").play();
      }
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    this.size = 0;
    new Audio("/audio/selected_large.mp3").play();
    this.roundName = this.game.rounds[Number(this.roundNumber)-1].name;
  }

  private async startLines(alt = false, vertical = false, faster = false, last = false) {
    let lineNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let contrastColorsArray: string[] = [];
    for (let j = 0; j < this.game.players.length; j++) {
      contrastColorsArray.push(ColorFader.getContrastColor(this.game.players[j].color));
    }
    let blackray: string[] = contrastColorsArray.filter(x => x === '#000000');
    let whiteray: string[] = contrastColorsArray.filter(x => x === '#FFFFFF');
    if (blackray.length > whiteray.length) {
      new ColorFader().fadeColor(this.fontColor, '#000000', 1000, col => this.fontColor = col);
    } else if (blackray.length < whiteray.length) {
      new ColorFader().fadeColor(this.fontColor, '#FFFFFF', 1000, col => this.fontColor = col);
    } else {
      new ColorFader().fadeColor(this.fontColor, '#FFFFFF', 5000, col => this.fontColor = col);

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
    if (vertical || last) {
      this.memory.music = this.selectMusic;
    } else {
      this.selectMusic.pause()
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

  private async lastRoundStinger() {
    let playerInFirst = '#FFFFFF'; //TODO
    new Audio('/audio/select/intro_select_last.mp3').play();
    this.fontColor = '#000000';
    this.squares.circle('#FFFFFF', 1, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 250));
    this.squares.randomPath('#FFFFFF', 15, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.fontColor = '#FFFFFF';
    this.squares.all('#000000')
    await new Promise(resolve => setTimeout(resolve, 700));
    this.squares.verticalLine(0, playerInFirst, 10, 1, 1, false);
    this.squares.verticalLine(9, playerInFirst, 10, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 300));
    this.squares.verticalLine(1, playerInFirst, 10, 1, 1, false);
    this.squares.verticalLine(8, playerInFirst, 10, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 300));
    this.squares.verticalLine(2, playerInFirst, 10, 1, 1, false);
    this.squares.verticalLine(7, playerInFirst, 10, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 200));
    this.squares.verticalLine(4, playerInFirst, 10, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 150));
    this.squares.verticalLine(5, playerInFirst, 10, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 200));
    this.squares.verticalLine(3, playerInFirst, 10, 1, 1, false);
    this.squares.verticalLine(6, playerInFirst, 10, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 650));
  }

  private async largeRoundStinger() {
    let playerInFirst = '#FFFFFF'; //TODO
    this.fontColor = '#000000';
    this.squares.all('#000000')
    new Audio('/audio/select/intro_select_large.mp3').play();
    this.squares.line(9, playerInFirst, 50, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 500));
    this.squares.line(8, playerInFirst, 1, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 400));
    this.squares.line(7, playerInFirst, 1, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 400));
    this.squares.line(6, playerInFirst, 1, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 300));
    this.squares.line(5, playerInFirst, 1, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 300));
    this.squares.line(4, playerInFirst, 1, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 250));
    this.squares.line(3, playerInFirst, 1, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 150));
    this.squares.line(2, playerInFirst, 1, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 150));
    this.squares.line(1, playerInFirst, 1, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 150));
    this.squares.line(0, playerInFirst, 1, 1, 1, false);
    await new Promise(resolve => setTimeout(resolve, 400));
  }

  protected readonly Math = Math;
}
