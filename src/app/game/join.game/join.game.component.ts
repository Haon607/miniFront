import { Component, OnDestroy } from '@angular/core';
import { Game, Player } from "../../models";
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
  game: Game = new Game();

  constructor(
    private gameService: GameReqService,
    private scoreboardService: ScoreboardService,
    private memory: MemoryGameService,
    private router: Router,
    private squares: SquaresService
  ) {
    // let startMusic = new Audio('/audio/start.mp3');
    // startMusic.play();
    // this.startAnimation(9);
    // startMusic.addEventListener('ended', () => {
    //   this.joinAble = true;
    //   this.getPlayers();
    // });
    this.joinAble = true; //DEBUG
    this.getPlayers(); //DEBUG

    gameService.createGame().subscribe(game => {
      this.game = game
      // this.game.id = 131; //DEBUG
    });
  }

  async getPlayers() {
    while (this.joinAble) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.gameService.getGame(this.game.id).subscribe(game => {
        this.scoreboardService.playerSubject.next(game.players);
        this.game = game;
        let colors = game.players.map((player: Player) => player.color);
        colors = this.squares.shuffleArray(colors);
        let i = 0;
        for (let coord of this.squares.shuffleArray(this.squares.allPath)) {
          if (colors[i] === undefined) {
            i = 0;
            if (colors[0] === undefined) {
              colors[0] = '#000080';
            }
          }
          this.squares.fadeSquares([coord], colors[i], 250);
          i++;
        }
      });
    }
  }

  ngOnDestroy() {
    this.joinAble = false;
  }

  startGame() {
    this.joinAble = false
    this.memory.gameId = this.game.id;

    this.gameService.setQuestions(this.game.id).subscribe(() => {})

    let playMusic = new Audio('/audio/play.mp3');
    playMusic.play();
    this.startAnimation(4);
    playMusic.addEventListener('ended', () => {
      this.router.navigateByUrl("/game/players");
    });
  }

  async startAnimation(repeats: number) {
    await this.squares.randomPath('#FFFFFF', 250, 10, repeats);
  }
}
