import { Component } from '@angular/core';
import { GameReqService } from "../../service/request/game.req.service";
import { MemoryPlayerService } from "../../service/memory/memory.player.service";
import { Router } from "@angular/router";
import { PlayerReqService } from "../../service/request/player.req.service";
import { PlayerRouting } from "../playerRouting";
import { ScoreboardComponent } from "../../scoreboard/scoreboard.component";
import { NgStyle } from "@angular/common";

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
  submitted: string[] = [];
  valid: string = 'selecting';

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
    if (this.valid === 'selecting') {
      if (this.selected.includes(answer)) {
        this.selected = this.selected.filter(sel => sel !== answer);
      } else {
        if (this.selected.length >= 4) {
          this.selected = [];
        }
        this.selected.push(answer);
        if (this.selected.length === 4) {
          this.submitted = this.selected;
          this.valid = "waiting";
          let selectedString = '';
          for (let selected of this.selected) {
            selectedString = selectedString + ';' + selected;
          }
          this.playerService.setInput(this.memory.playerId, selectedString.substring(1)).subscribe(player => {
            this.submitted = player.input.split(';');
            this.awaitResponse();
          });
        }
      }
    }
  }

  async awaitResponse() {
    while (this.valid !== 'valid' && this.valid !== 'invalid') {
      await new Promise(resolve => setTimeout(resolve, 250))
      this.playerService.getPlayer(this.memory.playerId).subscribe(player => {
        if (player.input === 'valid' || player.input === 'invalid') {
          this.valid = player.input;
          if (player.input === 'invalid') {
            this.playerService.deleteInput(this.memory.playerId).subscribe(() => {})
            this.wrong();
          }
        }
      });
    }
  }

  async wrong() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.selected = [];
    this.valid = 'selecting';
  }

  getColorForAnswer(answer: string) {
    if (this.selected.includes(answer)) {
      switch (this.valid) {
        case 'valid':
          return '#00FF00CC';
        case 'invalid':
          return '#FF0000CC';
        case 'selecting':
          return '#FFFFFF';
        case 'waiting':
          return '#FFFF00CC';
        default:
          return '';
      }
    } else {
      if (this.submitted.includes(answer)) {
        return '#FF888888';
      } else {
        return '#FFFFFF88'
      }
    }
  }
}
