import { Component } from '@angular/core';
import {MemoryGameService} from "../../service/memory/memory.game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GameReqService} from "../../service/request/game.req.service";
import {ScoreboardService} from "../../scoreboard/scoreboard.service";
import {SquaresService} from "../../squares/squares.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {Player} from "../../models";

@Component({
  selector: 'app-scoreboard.game',
  standalone: true,
  imports: [],
  templateUrl: './scoreboard.game.component.html',
  styleUrl: './scoreboard.game.component.css',
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
export class ScoreboardGameComponent {
  music = new Audio("audio/scoreboard.mp3");
  roundNumber = '';
  players: Player[] = [];

  constructor(
    private memory: MemoryGameService,
    private router: Router,
    private gameService: GameReqService,
    private scoreboard: ScoreboardService,
    private squares: SquaresService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.startAnimation();
    this.music.play();
    this.roundNumber = activatedRoute.snapshot.paramMap.get('round')!;

  }

  async startAnimation() {
    this.squares.allFade('#008000', 1000);
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.squares.allFade('#000080', 100);
    this.populatePlayers(this.memory.players)
  }

  async populatePlayers(players: Player[]) {
    players = players.sort((a, b) =>
      b.gameScore - a.gameScore
    )
    for (let player of players) {
      this.players.push(player);
      await new Promise(resolve => setTimeout(resolve, 1500 / players.length));
    }

    let playerString = '';

    for (let player of players) {
      playerString = playerString + '§' + player.name;
      playerString = playerString + ';' + player.gameScore;
      playerString = playerString + ';' + player.totalScore;
    }

    this.gameService.modifyData(this.memory.gameId, `/scoreboard/${this.roundNumber}`, playerString.substring(1)).subscribe(() => {});
  }

  skipToNext() {
    this.music.pause();
    this.music.currentTime = 0;
    this.router.navigateByUrl(`/game/rules/${Number(this.roundNumber)+1}`);
  }
}
