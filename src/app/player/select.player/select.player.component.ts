import { Component } from '@angular/core';
import { GameReqService } from "../../service/request/game.req.service";
import { MemoryPlayerService } from "../../service/memory/memory.player.service";
import { Router } from "@angular/router";
import { PlayerRouting } from "../playerRouting";
import { PlayerReqService } from "../../service/request/player.req.service";
import { NgStyle } from "@angular/common";
import { ColorFader } from "../../utils";

@Component({
  selector: 'app-select.player',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './select.player.component.html',
  styleUrl: './select.player.component.css'
})
export class SelectPlayerComponent {
  toSelect: string[] = [];
  selected: string = '';
  bgc: string = '';

  constructor(
    private gameService: GameReqService,
    private memory: MemoryPlayerService,
    private router: Router,
    private playerService: PlayerReqService,
  ) {
    this.bgc = memory.color;
    new PlayerRouting().routIf(router, memory, gameService);
    gameService.getGame(memory.gameId).subscribe(game => {
      this.toSelect = game.data.split(';');
    })
  }

  select(item: string) {
    this.playerService.setInput(this.memory.playerId, item).subscribe(player => this.selected = player.input);
  }

  protected readonly ColorFader = ColorFader;
}
