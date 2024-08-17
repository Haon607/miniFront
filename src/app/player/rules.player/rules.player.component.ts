import { Component } from '@angular/core';
import { MemoryPlayerService } from "../../service/memory/memory.player.service";
import { Router } from "@angular/router";
import { GameReqService } from "../../service/request/game.req.service";
import { PlayerRouting } from "../playerRouting";

@Component({
  selector: 'app-rules.player',
  standalone: true,
  imports: [],
  templateUrl: './rules.player.component.html',
  styleUrl: './rules.player.component.css'
})
export class RulesPlayerComponent {
  constructor(
    private memory: MemoryPlayerService,
    private router: Router,
    private gameService: GameReqService,
  ) {
    new PlayerRouting().routIf(router, memory, gameService);
  }
}
