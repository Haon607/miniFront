import { Component } from '@angular/core';
import { GameReqService } from "../../service/request/game.req.service";
import { MemoryPlayerService } from "../../service/memory/memory.player.service";
import { Router } from "@angular/router";
import { PlayerRouting } from "../playerRouting";
import { NgStyle } from "@angular/common";
import { PlayerReqService } from "../../service/request/player.req.service";

@Component({
  selector: 'app-idle.player',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './idle.player.component.html',
  styleUrl: './idle.player.component.css'
})
export class IdlePlayerComponent {
initial: boolean = false;
selectgame: boolean = false;
bgc: string = '';
colorList = ["#D2042D", "#0047AB", "#50C878", "#FFD300", "#F28500", "#7851A9", "#00FFFF", "#FF6F61", "#98FF98", "#800000", "#DAA520", "#40E0D0", "#E6E6FA", "#708090", "#008080", "#FF00FF", "#8888FF", "#808000", "#E97451", "#FF0090"]

  constructor(
    private gameService: GameReqService,
    private memory: MemoryPlayerService,
    private router: Router,
    private playerService: PlayerReqService,
  ) {
    new PlayerRouting().routIf(router, memory, gameService);
    this.initial = this.router.url === '/initial';
    this.selectgame = this.router.url === '/selectgame';

    playerService.getPlayer(memory.playerId).subscribe(player => {
      memory.color = player.color;
      this.bgc = memory.color;
    })

    if (this.selectgame) {
      this.gameService.getGame(memory.gameID).subscribe(game => 
        colorList = game.players.map(player => player.color);
      );
    }
  }

  select(color: string) {
    this.playerService.setColor(this.memory.playerId, color).subscribe(() =>  {
      this.playerService.getPlayer(this.memory.playerId).subscribe(player => {
      this.memory.color = player.color;
      this.bgc = this.memory.color;
    })});
  }
}
