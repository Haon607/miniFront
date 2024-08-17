import { Component } from '@angular/core';
import { MemoryPlayerService } from "../../service/memory/memory.player.service";
import { Router } from "@angular/router";
import { GameReqService } from "../../service/request/game.req.service";
import { Game } from "../../models";
import { ScoreboardComponent } from "../../scoreboard/scoreboard.component";
import { ScoreboardService } from "../../scoreboard/scoreboard.service";
import { MemoryGameService } from "../../service/memory/memory.game.service";

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

  constructor(
    private memory: MemoryGameService,
    private router: Router,
    private gameService: GameReqService,
    private scoreboard: ScoreboardService
  ) {
    gameService.modifyData(memory.gameId, '/idle').subscribe(game => {
      this.game = game;
      this.startRound();
    });
  }

  async startRound() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.scoreboard.playerSubject.next(this.memory.players);
    console.log(this.memory.players);
    this.scoreboard.sortSubject.next();
    this.scoreboard.totalSubject.next(false);
  }
}
