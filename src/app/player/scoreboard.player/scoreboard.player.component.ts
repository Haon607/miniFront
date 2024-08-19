import {Component} from '@angular/core';
import {MemoryPlayerService} from "../../service/memory/memory.player.service";
import {Router} from "@angular/router";
import {GameReqService} from "../../service/request/game.req.service";
import {PlayerRouting} from "../playerRouting";

@Component({
  selector: 'app-scoreboard-player',
  standalone: true,
  imports: [],
  templateUrl: './scoreboard.player.component.html',
  styleUrls: ['./scoreboard.player.component.css']  // Corrected 'styleUrls'
})
export class ScoreboardPlayerComponent {
  data: string[][] = [];

  constructor(
    private gameService: GameReqService,
    private memory: MemoryPlayerService,
    private router: Router,
  ) {
    new PlayerRouting().routIf(this.router, this.memory, this.gameService);
    this.gameService.getGame(this.memory.gameId).subscribe(game => {
      this.data = game.data.split('§').map(element => element.split(';'));
    });
  }
}
