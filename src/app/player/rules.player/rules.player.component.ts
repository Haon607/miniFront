import { Component } from '@angular/core';
import { MemoryPlayerService } from "../../service/memory/memory.player.service";
import {ActivatedRoute, Router} from "@angular/router";
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
  roundNumber = '';

  constructor(
    private memory: MemoryPlayerService,
    private router: Router,
    private gameService: GameReqService,
    private activatedRoute: ActivatedRoute,
  ) {
    new PlayerRouting().routIf(router, memory, gameService);
    this.roundNumber = activatedRoute.snapshot.paramMap.get('round')!;
  }
}
