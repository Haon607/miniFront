import {Component, input, OnDestroy} from '@angular/core';
import {GameReqService} from "../../../service/request/game.req.service";
import {MemoryPlayerService} from "../../../service/memory/memory.player.service";
import {Router} from "@angular/router";
import {NgStyle} from "@angular/common";
import {ColorFader} from "../../../utils";
import {Player} from "../../../models";
import {PlayerReqService} from "../../../service/request/player.req.service";
import { Constants } from "../../../constants";

@Component({
  selector: 'app-sound-sequence.round.player',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './sound-sequence.round.player.component.html',
  styleUrl: './sound-sequence.round.player.component.css'
})
export class SoundSequenceRoundPlayerComponent implements OnDestroy {
  bgc: string = '';
  data: string = '';
  do = true;
  players: Player[] = [];
  input: string[] = [];
  disableButtons: boolean = false;

  constructor(
    private gameService: GameReqService,
    private memory: MemoryPlayerService,
    private router: Router,
    private playerService: PlayerReqService
  ) {
    this.bgc = memory.color;
    this.startFetch();
  }

  playSound(test = false) {
    let sound = new Audio("/audio/rounds/sound-sequence/key" + String(Math.floor((Math.random() * 4) + 1)) + ".mp3");
    if (!test) {
      this.bgc = ColorFader.getContrastColor(this.bgc);
      sound.addEventListener('ended', () => {
        this.gameService.modifyData(this.memory.gameId, "/sound", "").subscribe(() => {
          this.bgc = this.memory.color;
        });
      })
    }
    sound.play();
  }

  protected readonly ColorFader = ColorFader;

  private async startFetch() {
    while (this.do) {
      this.gameService.getGame(this.memory.gameId).subscribe(game => {
        if (game.data === 'select' && this.data !== 'select') {
          this.input = [];
          this.disableButtons = false
        }
        this.data = game.data;
        if (game.route !== this.router.url) {
          this.router.navigateByUrl(game.route);
          this.do = false;
        }
        if (this.players.length === 0) {
          this.players = game.players;
          let gamePlayer = new Player(-1, Constants.GAMEOPTIONAME);
          gamePlayer.color = '#000000';
          gamePlayer.fontColor = '#FFFFFF';
          this.players.push(gamePlayer);
        }
        if (this.data === String(this.memory.playerId)) {
          this.gameService.modifyData(this.memory.gameId, "/sound", "playing").subscribe(() => {
            this.playSound();
          })
        }
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  addToInput(playerId: number) {
    this.disableButtons = true;
    this.input.push(playerId.toString());
    this.playerService.setInput(this.memory.playerId, this.input.join(';')).subscribe(() => {
      this.disableButtons = false;
    });
  }

  ngOnDestroy(): void {
    this.do = false;
  }

  delete() {
    this.disableButtons = true;
    this.input = [];
    this.playerService.setInput(this.memory.playerId, "").subscribe(() => {
      this.disableButtons = false;
    });
  }

  submit() {
    this.disableButtons = true;
    this.input.push('done');
    this.playerService.setInput(this.memory.playerId, this.input.join(';')).subscribe(() => {});
  }
}
