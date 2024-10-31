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
      this.rulesMusic.src = '/audio/rules.mp3';
      this.rulesMusic.play();
    });

    this.roundNumber = activatedRoute.snapshot.paramMap.get('round')!;
    let realRoundNumber = Number(this.roundNumber) -1;
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
      this.rulesMusic.src = '/audio/rules.mp3';
      this.rulesMusic.play();
    }

    this.imageSource = "test.gif"

    // this.skipToNext()
  }

  skipToNext() {
    //TODO some feedback
    this.animate = false;
    this.gameService.modifyData(this.memory.gameId, '/idle').subscribe(() => {})
  }

  private async startAnimation() {
    this.animate = true;

    let colors = this.game.players.map(player => player.color);
    let i = 0;
    while (this.animate) {
      let color = '';
      if (colors.length > 1) {
        color = colors[i % colors.length];
      } else {
        let colorList = [colors[0], ColorFader.adjustBrightness(colors[0], 10), ColorFader.adjustBrightness(colors[0], -10)];
        color = colorList[i % colorList.length];
      }
      this.squares.allFade(color, 750);
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.squares.circle(ColorFader.adjustBrightness(color, ColorFader.getContrastColor(color) === '#FFFFFF' ? 25 : -25), 1500, 10, 1, true);
      await new Promise(resolve => setTimeout(resolve, 9000));
      this.doneEmitter.emit();
      i++;
    }
  }
}
