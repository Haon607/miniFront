import { Component, EventEmitter } from '@angular/core';
import { SquaresService } from "../../squares/squares.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { GameReqService } from "../../service/request/game.req.service";
import { Game } from "../../models";
import { NgOptimizedImage } from "@angular/common";
import { ColorFader } from "../../utils";

@Component({
  selector: 'app-rules.game',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './rules.game.component.html',
  styleUrl: './rules.game.component.css'
})
export class RulesGameComponent {
  displayHints: boolean = false;
  rulesMusic = new Audio();
  roundNumber = '';
  game: Game = new Game();
  imageSource: string = '';
  animate: boolean = false;
  doneEmitter = new EventEmitter();

  constructor(
    private squares: SquaresService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private memory: MemoryGameService,
    private gameService: GameReqService,
  ) {
    this.doneEmitter.subscribe(() => {
      if (!this.animate) {
        this.rulesMusic.pause();
        this.rulesMusic.currentTime = 0;
        // this.squares.all('#000000')
        // this.router.navigateByUrl(`/game/select/${realRoundNumber+2}`)
        this.router.navigateByUrl(`/game/round/${this.game.rounds[realRoundNumber].route}/${this.roundNumber}`)
      }
    })
    this.rulesMusic = this.memory.music;

    this.rulesMusic.addEventListener('ended', () => {
      this.rulesMusic.src = '/audio/rules/rules.mp3';
      this.rulesMusic.play();
    });

    this.roundNumber = activatedRoute.snapshot.paramMap.get('round')!;
    let realRoundNumber = Number(this.roundNumber) - 1;
    this.gameService.getGame(memory.gameId).subscribe(game => {
      console.log(game);
      this.game = game;
      gameService.modifyData(memory.gameId, '/rules/' + this.roundNumber, game.rounds[realRoundNumber].name + '§' + game.rounds[realRoundNumber].rules).subscribe(game2 => {
        this.game = game2;
        this.startAnimation();
      })
    });
    this.displayHints = false;

    if (this.rulesMusic.paused) {
      this.rulesMusic.src = '/audio/rules/rules.mp3';
      this.rulesMusic.play();
    }

    this.imageSource = "test.gif"
  }

  skipToNext() {
    //TODO some feedback
    new Audio("/audio/simple_feedback.mp3").play();
    this.animate = false;
    this.gameService.modifyData(this.memory.gameId, '/idle').subscribe(() => {
    })
  }

  private async startAnimation() {
    this.animate = true;

    let colors = this.game.players.map(player => player.color);
    let i = 0;
    let bool = false;
    while (this.animate) {
      let color = '';
      if (colors.length > 2) {
        color = colors[i % colors.length];
      } else if (colors.length === 2) {
        let colorList = [colors[0], colors[1], ColorFader.adjustBrightness(colors[i % 2], ColorFader.getContrastColor(colors[i % 2]) === '#000000' ? -50 : 50)];
        color = colorList[i % colorList.length];
      } else {
        let colorList = [colors[0], ColorFader.adjustBrightness(colors[0], 10), ColorFader.adjustBrightness(colors[0], -10)];
        color = colorList[i % colorList.length];
      }

      this.squares.fadeSquares(bool ? this.squares.checkerPath : this.squares.checkerPathInv, color, 2000);
      await new Promise(resolve => setTimeout(resolve, 2500));
      this.doneEmitter.emit();
      i++;
      bool = !bool;
    }
  }
}
