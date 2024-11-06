import {Component, input, OnDestroy} from '@angular/core';
import {GameReqService} from "../../../service/request/game.req.service";
import {MemoryPlayerService} from "../../../service/memory/memory.player.service";
import {Router} from "@angular/router";
import {NgStyle} from "@angular/common";
import {ColorFader} from "../../../utils";
import {Player} from "../../../models";
import {PlayerReqService} from "../../../service/request/player.req.service";

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
  input: number[] = [];

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
        }
        this.data = game.data;
        if (game.route !== this.router.url) {
          this.router.navigateByUrl(game.route);
          this.do = false;
        }
        if (!this.players) {
          this.players = game.players;
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
    this.input.push(playerId);
    this.playerService.setInput(this.memory.playerId, this.input.join(';')).subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.do = false;
  }
}
