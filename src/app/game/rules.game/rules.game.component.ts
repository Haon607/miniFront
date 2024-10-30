import { Component } from '@angular/core';
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

  constructor(
    private squares: SquaresService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private memory: MemoryGameService,
    private gameService: GameReqService,
  ) {
    this.roundNumber = activatedRoute.snapshot.paramMap.get('round')!;

    gameService.modifyData(memory.gameId, '/rules/' + this.roundNumber).subscribe(game =>
      this.game = game
    );
    this.displayHints = false;

    // this.rulesMusic.src = '/audio/rules.mp3'; //TODO
    // this.rulesMusic.play();

    this.startAnimation();

    this.memory.music.pause();
    this.roundNumber = String(Number(this.roundNumber)+1)

    this.imageSource = "test.gif"

    // this.skipToNext()
  }

  skipToNext() {
    this.rulesMusic.pause();
    this.rulesMusic.currentTime = 0;
    this.router.navigateByUrl(`/game/select/${this.roundNumber}`)
    // this.router.navigateByUrl(`/game/round/${this.roundNumber}`)
  }

  private async startAnimation() {
    //TODO
  }

  get roundName() {
    return this.game?.rounds[Number(this.roundNumber)]?.name ?? '';
  }
}
