import {Component} from '@angular/core';
import {GameReqService} from "../../service/request/game.req.service";
import {MemoryPlayerService} from "../../service/memory/memory.player.service";
import {Router} from "@angular/router";
import {PlayerReqService} from "../../service/request/player.req.service";
import {PlayerRouting} from "../playerRouting";
import {ScoreboardComponent} from "../../scoreboard/scoreboard.component";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-select.second.player',
  standalone: true,
  imports: [
    ScoreboardComponent,
    NgStyle
  ],
  templateUrl: './select.second.player.component.html',
  styleUrl: './select.second.player.component.css'
})
export class SelectSecondPlayerComponent {
  toSelect: string[][] = [];
  selected: string[] = [];

  constructor(
    private gameService: GameReqService,
    private memory: MemoryPlayerService,
    private router: Router,
    private playerService: PlayerReqService,
  ) {
    new PlayerRouting().routIf(router, memory, gameService);
    gameService.getGame(memory.gameId).subscribe(game => {
      let groups = game.data.split('§');
      this.toSelect = groups.map(group => {
        group = group.substring(1);
        return group.split(';');
      });
    })
  }

  select(answer: string) {
    if (this.selected.includes(answer)) {
      this.selected = this.selected.filter(sel => sel !== answer);
    } else {
      if (this.selected.length >= 4) {
        this.selected = [];
      }
      this.selected.push(answer);
    }
  }
}
