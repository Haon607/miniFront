import { Component, OnDestroy } from '@angular/core';
import { GameReqService } from "../../service/request/game.req.service";
import { MemoryPlayerService } from "../../service/memory/memory.player.service";
import { Router } from "@angular/router";
import { routes } from "../../app.routes";
import { PlayerRouting } from "../playerRouting";

@Component({
  selector: 'app-idle.player',
  standalone: true,
  imports: [],
  templateUrl: './idle.player.component.html',
  styleUrl: './idle.player.component.css'
})
export class IdlePlayerComponent {

  constructor(
    private gameService: GameReqService,
    private memory: MemoryPlayerService,
    private router: Router,
  ) {
    new PlayerRouting().routIf(router, memory, gameService);
  }

}
