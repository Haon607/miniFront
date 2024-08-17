import { Component } from '@angular/core';
import { Player } from "../../models";
import { GameReqService } from "../../service/request/game.req.service";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { Router } from "@angular/router";

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
  playerIntroMusic = new Audio('/audio/player_intro.mp3');


  constructor(
    private gameService: GameReqService,
    private memory: MemoryGameService,
    private router: Router
  ) {
    gameService.getGame(memory.gameId).subscribe(game => {
        let players = game.players.sort((a, b) =>
          b.totalScore - a.totalScore
        )
        this.populatePlayers(players);
      }
    );
    this.playerIntroMusic.play();
    this.playerIntroMusic.addEventListener('ended', () => {
      this.router.navigateByUrl("/game/players");
    });
  }

  async populatePlayers(players: Player[]) {
    for (let player of players) {
      this.players.push(player);
      await new Promise(resolve => setTimeout(resolve, 1500 / players.length));
    }
  }

  skipToNext() {
    this.playerIntroMusic.pause();
    this.playerIntroMusic.currentTime = 0;
    this.router.navigateByUrl("/game/join");
  }
}
