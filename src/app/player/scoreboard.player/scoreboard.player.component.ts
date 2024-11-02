import {Component} from '@angular/core';
import {MemoryPlayerService} from "../../service/memory/memory.player.service";
import {Router} from "@angular/router";
import {GameReqService} from "../../service/request/game.req.service";
import {PlayerRouting} from "../playerRouting";
import { ColorFader } from "../../utils";
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-scoreboard-player',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './scoreboard.player.component.html',
  styleUrls: ['./scoreboard.player.component.css']  // Corrected 'styleUrls'
})
export class ScoreboardPlayerComponent {
  data: string[][] = [];
  bgc: string = '';

  constructor(
    private gameService: GameReqService,
    private memory: MemoryPlayerService,
    private router: Router,
  ) {
    new PlayerRouting().routIf(this.router, this.memory, this.gameService);
    this.bgc = this.memory.color
    this.gameService.getGame(this.memory.gameId).subscribe(game => {
      this.data = game.data.split('§').map(element => element.split(';'));
    });
  }

  protected readonly ColorFader = ColorFader;
}
