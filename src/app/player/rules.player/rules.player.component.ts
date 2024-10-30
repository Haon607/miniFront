import { Component } from '@angular/core';
import { MemoryPlayerService } from "../../service/memory/memory.player.service";
import {ActivatedRoute, Router} from "@angular/router";
import { GameReqService } from "../../service/request/game.req.service";
import { PlayerRouting } from "../playerRouting";
import { ColorFader } from "../../utils";
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-rules.player',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './rules.player.component.html',
  styleUrl: './rules.player.component.css'
})
export class RulesPlayerComponent {
  roundNumber = '';
  rules = '';
  bgc: string = '';

  constructor(
    private memory: MemoryPlayerService,
    private router: Router,
    private gameService: GameReqService,
    private activatedRoute: ActivatedRoute,
  ) {
    new PlayerRouting().routIf(router, memory, gameService);
    this.roundNumber = activatedRoute.snapshot.paramMap.get('round')!;
    gameService.getGame(memory.gameId).subscribe(game => {
      this.rules = game.data;
    })
    this.bgc = memory.color;
  }

  protected readonly ColorFader = ColorFader;
}
