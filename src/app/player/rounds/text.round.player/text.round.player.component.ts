import { Component } from '@angular/core';
import { GameReqService } from "../../../service/request/game.req.service";
import { MemoryPlayerService } from "../../../service/memory/memory.player.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PlayerReqService } from "../../../service/request/player.req.service";
import { PlayerRouting } from "../../playerRouting";
import { NgStyle } from "@angular/common";
import { ColorFader } from "../../../utils";

@Component({
  selector: 'app-text.round.player',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './text.round.player.component.html',
  styleUrl: './text.round.player.component.css'
})
export class TextRoundPlayerComponent {
  prompt: string = '';
  inputted: string = '';
  bgc: string = '';
  disableInputAndButton = false;
  dash = false;

  constructor(
    private gameService: GameReqService,
    private memory: MemoryPlayerService,
    private router: Router,
    private playerService: PlayerReqService,
  ) {
    this.bgc = memory.color;
    this.dash = router.url.includes('dash');
    new PlayerRouting().routIf(router, memory, gameService);
    gameService.getGame(memory.gameId).subscribe(game => {
      this.prompt = game.data;
    })
  }

  send(input: HTMLInputElement) {
    this.disableInputAndButton = true;
    this.playerService.setInput(this.memory.playerId, this.inputted && this.dash ? this.inputted + ';' + input.value : input.value).subscribe(player => {
      this.inputted = player.input;
      if (this.dash) {
        input.value = "";
        this.disableInputAndButton = false;
      }
    });
  }

  protected readonly ColorFader = ColorFader;
}

