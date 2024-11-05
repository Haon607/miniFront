import { Component } from '@angular/core';
import {GameReqService} from "../../../service/request/game.req.service";
import {PlayerReqService} from "../../../service/request/player.req.service";
import {MemoryGameService} from "../../../service/memory/memory.game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SquaresService} from "../../../squares/squares.service";
import {ScoreboardService} from "../../../scoreboard/scoreboard.service";
import {Game, Round} from "../../../models";

@Component({
  selector: 'app-sound-sequence.round.game',
  standalone: true,
  imports: [],
  templateUrl: './sound-sequence.round.game.component.html',
  styleUrl: './sound-sequence.round.game.component.css'
})
export class SoundSequenceRoundGameComponent {
  game: Game = new Game();
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
      this.startRound();
    });
    this.initScoreboard();
  }
  async initScoreboard() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.scoreboard.playerSubject.next(this.memory.players);
    this.scoreboard.totalSubject.next(false);
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.scoreboard.sortSubject.next();
  }

  startRound() {
    this.gameService.modifyData(this.memory.gameId, "/sound", "test").subscribe(() => {});

  }
}
