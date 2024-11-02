import { Component } from '@angular/core';
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { ActivatedRoute, Router } from "@angular/router";
import { GameReqService } from "../../service/request/game.req.service";
import { ScoreboardService } from "../../scoreboard/scoreboard.service";
import { SquaresService } from "../../squares/squares.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { Player } from "../../models";
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-scoreboard.game',
  standalone: true,
  imports: [
    NgStyle
  ],
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
  music = new Audio("audio/scoreboard/scoreboard.mp3"); //TODO SHORTEN OR FIND DIFFREND
  roundNumber = '';
  players: Player[] = [];
  private anim: boolean = true;

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
    this.music.loop = true;
  }

  async startAnimation() {
    this.populatePlayers(this.memory.players)
    await new Promise(resolve => setTimeout(resolve, 2000));
    let colorRay = this.generateColorArray(this.getPlayerColorsAndPercentages())
    while (this.anim) {
      let path = this.squares.shuffleArray(this.squares.allPath);
      for (let i = 0; i < 100 && this.anim; i++) {
        this.squares.fadeSquares([path[i]], colorRay[i], 1000);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
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
    }

    this.gameService.modifyData(this.memory.gameId, `/scoreboard/${this.roundNumber}`, playerString.substring(1)).subscribe(() => {});
  }

  skipToNext() {
    this.anim = false;
    this.music.pause();
    this.music.currentTime = 0;
    this.router.navigateByUrl(`/game/select/${Number(this.roundNumber)+1}`);
  }

  getPlayerColorsAndPercentages(): { color: string; percent: number }[] {
    // Calculate the total score from all players
    const totalScore = this.players.reduce((sum, player) => sum + player.gameScore, 0);

    // Create a list of objects with each player's color and their integer percentage of the total score
    let percentages = this.players
      .sort((a, b) => b.gameScore - a.gameScore) // Sort players by score in descending order
      .map(player => ({
        color: player.color,
        rawPercent: Math.floor((player.gameScore / totalScore) * 100)
      }));

    // Calculate the difference to reach exactly 100%
    let totalPercent = percentages.reduce((sum, p) => sum + p.rawPercent, 0);
    let remainder = 100 - totalPercent;

    // Distribute the remainder to the top scorers to make the total sum up to 100%
    return percentages.map((p, index) => ({
      color: p.color,
      percent: p.rawPercent + (index < remainder ? 1 : 0) // Add 1 to the first 'remainder' items
    }));
  }
  generateColorArray(colorDistribution: { color: string; percent: number }[]): string[] {
    const colorArray: string[] = [];

    colorDistribution.forEach(({ color, percent }) => {
      // Push the player's color `percent` times into the array
      for (let i = 0; i < percent; i++) {
        colorArray.push(color);
      }
    });

    return colorArray;
  }


}
