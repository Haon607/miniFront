import { Component } from '@angular/core';
import { SquaresService } from "../../squares/squares.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { GameReqService } from "../../service/request/game.req.service";
import { Game } from "../../models";

@Component({
  selector: 'app-select.game',
  standalone: true,
  imports: [],
  templateUrl: './select.game.component.html',
  styleUrl: './select.game.component.css'
})
export class SelectGameComponent {
  selectMusic = new Audio();
  roundNumber = '';
  roundName = '#######'
  game: Game = new Game();

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
    this.selectMusic.addEventListener('ended', () => {
      // this.skipToNext();
    });

  }

  private async startFirstAnimation() {
    this.squares.allFade('#000000', 250)
    await new Promise(resolve => setTimeout(resolve, 250));
    this.startLines();
    this.roundName = this.game.rounds[0].name;
  }

  private async startLines() {
    let lineNumber = [0,1,2,3,4,5,6,7,8,9];
    lineNumber = this.squares.shuffleArray(lineNumber)
    for (let i = 0; i < 10; i++) { //TODO TIME THIS WITH
                                            //TODO ROULETTE
      let color = this.game.players[i % this.game.players.length].color;
      for(let j = 0; j < 10; j++) {
        this.squares.line(lineNumber[j], color, 250, 10, 1, false);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  skipToNext() {
    this.selectMusic.pause();
    this.selectMusic.currentTime = 0;
    this.router.navigateByUrl(`/game/round/${this.roundNumber}`)
  }
}
