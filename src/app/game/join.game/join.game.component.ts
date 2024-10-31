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
  colors: string[] = [];

  constructor(
    private gameService: GameReqService,
    private scoreboardService: ScoreboardService,
    private memory: MemoryGameService,
    private router: Router,
    private squares: SquaresService
  ) {
    // let startMusic = new Audio('/audio/startmusic.mp3');
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
        if (game.players?.length > 0) {
          if (this.game.players.length !== game.players.length) {
            new Audio('/audio/join.mp3').play();
          }
        }
        this.game = game;
        let colors = game.players.map((player: Player) => player.color);
        colors = this.squares.shuffleArray(colors);
        let i = 0;
        if (colors[1] === undefined) {
          colors.push('#000080');
        }
        this.colors = colors;
        for (let coord of this.squares.shuffleArray(this.squares.allPath)) {
          if (colors[i] === undefined) {
            i = 0;
          }
          this.squares.fadeSquares([coord], colors[i], 500);
          i++;
        }
      });
    }
  }

  ngOnDestroy() {
    this.joinAble = false;
  }

  async startGame() {
    if (this.joinAble) {
      new Audio('/audio/start.mp3').play();
      this.joinAble = false
      this.memory.gameId = this.game.id;

      this.gameService.modifyData(this.memory.gameId, "/idle").subscribe(() => {})
      let rounds = 4;
      let largeRounds = 2;
      this.gameService.setRounds(this.game.id, this.game.players.length, rounds, largeRounds).subscribe(() =>{})
      this.memory.rounds = rounds;

      await new Promise(resolve => setTimeout(resolve, 1000));

      let playMusic = new Audio('/audio/startmusic.mp3');
      playMusic.play();
      this.memory.music = playMusic;
      this.startAnimation();

      await new Promise(resolve => setTimeout(resolve, 5000));
      this.router.navigateByUrl("/game/players");
    }
  }

  async startAnimation(loops = 8) {
    let path = this.squares.shuffleArray(this.squares.allPath)
    let i = 0;
    if (this.colors[1] === undefined) {
      this.colors.push('#FFFFFF');
      this.colors.push('#FF0000');
      this.colors.push('#FFFF00');
      this.colors.push('#00FF00');
      this.colors.push('#00FFFF');
      this.colors.push('#0000FF');
      this.colors.push('#FF00FF');
    }
    for (let o = 0; o < loops; o++) {
      for (let coord of path) {
        if (this.colors[i] === undefined) {
          i = 0;
        }
        this.squares.fadeSquares([coord], this.colors[i], 100);
        await new Promise(resolve => setTimeout(resolve, 1));
        i++;
      }
        // this.colors = this.squares.shuffleArray(this.colors);
      this.colors = this.colors.reverse();
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    this.squares.allFade('#000000', 250);
  }
}
