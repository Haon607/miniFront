import { Component, OnDestroy } from '@angular/core';
import { Game } from "../../models";
import { ScoreboardComponent } from "../../scoreboard/scoreboard.component";
import { GameReqService } from "../../service/request/game.req.service";
import { ScoreboardService } from "../../scoreboard/scoreboard.service";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { Router } from "@angular/router";
import { SquaresService } from "../../squares/squares.service";

@Component({
  selector: 'app-join.game',
  standalone: true,
  imports: [
    ScoreboardComponent
  ],
  templateUrl: './join.game.component.html',
  styleUrl: './join.game.component.css'
})
export class JoinGameComponent implements OnDestroy {
  joinAble = false;
  game: Game = new Game(NaN, [], '')

  constructor(
    private gameService: GameReqService,
    private scoreboardService: ScoreboardService,
    private memory: MemoryGameService,
    private router: Router,
    private squares: SquaresService
  ) {
    let startMusic = new Audio('/audio/start.mp3');
    startMusic.play();
    this.startAnimation();
    startMusic.addEventListener('ended', () => {
      // this.joinAble = true;
      // this.getPlayers();
    });

    this.joinAble = true; //DEBUG
    this.getPlayers(); //DEBUG

    gameService.createGame().subscribe(game => {
      this.game = game
      // this.game.id = 131; //DEBUG
    });
  }

  async getPlayers() {
    while (this.joinAble) {
      await new Promise(resolve => setTimeout(resolve, 500));

      this.gameService.getGame(this.game.id).subscribe(game => {
        this.scoreboardService.playerSubject.next(game.players);
        this.game = game;
      });
    }
  }

  ngOnDestroy() {
    this.joinAble = false;
  }

  startGame() {
    this.joinAble = false
    this.memory.gameId = this.game.id;

    let playMusic = new Audio('/audio/play.mp3');
    playMusic.play();
    playMusic.addEventListener('ended', () => {
      this.router.navigateByUrl("/game/players");
    });
  }

  async startAnimation() {
    await this.squares.randomPath('#FFFFFF', 250, 10, 9);
  }
}
