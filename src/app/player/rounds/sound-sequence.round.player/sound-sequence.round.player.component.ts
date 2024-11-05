import { Component } from '@angular/core';
import {GameReqService} from "../../../service/request/game.req.service";
import {MemoryPlayerService} from "../../../service/memory/memory.player.service";
import {Router} from "@angular/router";
import {PlayerReqService} from "../../../service/request/player.req.service";
import {PlayerRouting} from "../../playerRouting";
import {NgStyle} from "@angular/common";
import {ColorFader} from "../../../utils";

@Component({
  selector: 'app-sound-sequence.round.player',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './sound-sequence.round.player.component.html',
  styleUrl: './sound-sequence.round.player.component.css'
})
export class SoundSequenceRoundPlayerComponent {
  bgc: string = '';
  data: string = '';

  constructor(
    private gameService: GameReqService,
    private memory: MemoryPlayerService,
    private router: Router,
    private playerService: PlayerReqService,
  ) {
    this.bgc = memory.color;
    new PlayerRouting().routIf(router, memory, gameService);
    gameService.getGame(memory.gameId).subscribe(game => {
      this.data = game.data;
    })
  }

  playSound() {
    new Audio("/audio/rounds/sound-sequence/key" + String(Math.floor((Math.random()*3)+1)) + ".mp3").play();
  }

  protected readonly ColorFader = ColorFader;
}
