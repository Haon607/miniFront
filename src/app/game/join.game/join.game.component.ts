import { Component, OnDestroy } from '@angular/core';
import { Game } from "../../models";
import { ScoreboardComponent } from "../../scoreboard/scoreboard.component";
import { GameReqService } from "../../service/request/game.req.service";
import { ScoreboardService } from "../../scoreboard/scoreboard.service";

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

  constructor(private gameService: GameReqService, private scoreboardService: ScoreboardService) {
    let startMusic = new Audio('/audio/start.mp3');
    startMusic.play();
    startMusic.addEventListener('ended', () => {
      // this.joinAble = true;
      // this.getPlayers();
    });
    this.joinAble = true; //DEBUG
    this.getPlayers(); //DEBUG

    gameService.createGame().subscribe(game => this.game = game);
  }

  async getPlayers() {
    while (this.joinAble) {
      await new Promise(resolve => setTimeout(resolve, 500));
      this.gameService.getGame(this.game.id).subscribe(game => this.scoreboardService.playerSubject.next(game.players));
    }
  }

  ngOnDestroy() {
    this.joinAble = false;
  }
}
