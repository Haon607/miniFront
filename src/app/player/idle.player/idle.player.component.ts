import { Component, OnDestroy } from '@angular/core';
import { GameReqService } from "../../service/request/game.req.service";
import { MemoryPlayerService } from "../../service/memory/memory.player.service";

@Component({
  selector: 'app-idle.player',
  standalone: true,
  imports: [],
  templateUrl: './idle.player.component.html',
  styleUrl: './idle.player.component.css'
})
export class IdlePlayerComponent implements OnDestroy{
  endLoop = false;

  constructor(
    private gameService: GameReqService,
    private memory: MemoryPlayerService
  ) {
    this.startLoop();
  }

  async startLoop() {
    while (!this.endLoop) {
      this.gameService.getGame(this.memory.gameId).subscribe(game => {
        console.log(game)
      });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  ngOnDestroy() {
    this.endLoop = true
  }
}
