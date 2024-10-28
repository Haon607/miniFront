import { Component } from '@angular/core';
import { Player } from "../../models";
import { GameReqService } from "../../service/request/game.req.service";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { Router } from "@angular/router";
import { SquaresService } from "../../squares/squares.service";
import { ColorFader } from "../../utils";
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-player-intro.game',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './player-intro.game.component.html',
  styleUrl: './player-intro.game.component.css',
  animations: [
    trigger('slide', [
      transition('void => *', [
        style({
          position: "relative",
          right: "-1300px",
        }),
        animate('250ms ease-out', style({
          right: "0"
        })),
      ]),
      transition('* => void', [
        style({
          position: "relative",
          left: "0"
        }),
        animate('250ms ease-in', style({
          left: "-1300px"
        }))
      ])
    ])
  ]
})
export class PlayerIntroGameComponent {
  players: Player[] = [];
  spin = true;

  constructor(
    private gameService: GameReqService,
    private memory: MemoryGameService,
    private router: Router,
    private squares: SquaresService
  ) {
    gameService.getGame(memory.gameId).subscribe(game => {
        let players = game.players.sort((a, b) =>
          b.totalScore - a.totalScore
        )
        players.forEach(player => {
          player.gameScore = 0
        });
        players = players.map(player => {
          player.fontColor = new ColorFader().getContrastColor(player.color);
          return player;
        })
        memory.players = players;
        this.populatePlayers(players);
        this.animate()
      }
    );
  }

  async populatePlayers(players: Player[]) {
    for (let player of players) {
      this.players.push(player);
      await new Promise(resolve => setTimeout(resolve, 1500 / players.length));
    }
  }

  async skipToNext() {
    if (this.spin) {
      this.spin = false;
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.memory.music.pause();
      this.router.navigateByUrl("/game/select/1");
    }
  }

  private async animate() {
    let oldColor = "";
    let newColor = "";
    while (this.spin) {
      do {
        newColor = this.squares.shuffleArray(this.players.map(player => player.color))[0];
      } while (newColor === oldColor && this.players.length > 1);
      this.squares.fadeSquares([[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
        [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
        [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8],
        [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8],
        [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8],
        [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8],
        [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8],
        [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8]], new ColorFader().adjustBrightness(newColor, -50), 750)
      await this.squares.circle(newColor, 250, 10, 1, this.players.length < 2);
      oldColor = newColor;
    }
  }
}
