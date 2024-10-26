import { Component } from '@angular/core';
import { Player } from "../../models";
import { GameReqService } from "../../service/request/game.req.service";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { Router } from "@angular/router";
import { SquaresService } from "../../squares/squares.service";

@Component({
  selector: 'app-player-intro.game',
  standalone: true,
  imports: [],
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
    this.spin = false;
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.router.navigateByUrl("/game/rules/1");
  }

  private async animate() {
    let oldColor = "";
    let newColor = "";
    while (this.spin) {
      do {
        newColor = this.squares.shuffleArray(this.players.map(player => player.color))[0];
      } while (newColor === oldColor && this.players.length > 1);
      await this.squares.circle(newColor, 250, 10, 1, this.players.length < 2);
      oldColor = newColor;
    }
  }
}
