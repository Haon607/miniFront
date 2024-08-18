import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { GameReqService } from "../../service/request/game.req.service";
import { Game } from "../../models";
import { ScoreboardComponent } from "../../scoreboard/scoreboard.component";
import { ScoreboardService } from "../../scoreboard/scoreboard.service";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { SquaresService } from "../../squares/squares.service";

@Component({
  selector: 'app-first.round.game',
  standalone: true,
  imports: [
    ScoreboardComponent
  ],
  templateUrl: './first.round.game.component.html',
  styleUrl: './first.round.game.component.css'
})
export class FirstRoundGameComponent {
  game?: Game;
  music = new Audio();

  constructor(
    private memory: MemoryGameService,
    private router: Router,
    private gameService: GameReqService,
    private scoreboard: ScoreboardService,
    private squares: SquaresService,
  ) {
    gameService.modifyData(memory.gameId, '/idle').subscribe(game => {
      this.game = game;
    });
    this.initScoreboard();
    this.roundController();
  }

  async initScoreboard() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.scoreboard.playerSubject.next(this.memory.players);
    this.scoreboard.sortSubject.next();
    this.scoreboard.totalSubject.next(false);
  }

  async roundController() {
    await this.startRound();
  }

  async startRound() {
    this.music.src = "/audio/round1start.mp3";
    this.music.play();
    await this.squares.randomPath('#3333FF', 15, 1, 1, false);
    await this.squares.all('#5555FF');
    await this.squares.allFade('#000080', 5000);

  }
}
