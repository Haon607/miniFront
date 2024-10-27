import {Component} from '@angular/core';
import {Player} from "../../models";
import {PlayerReqService} from "../../service/request/player.req.service";
import {GameReqService} from "../../service/request/game.req.service";
import {MemoryPlayerService} from "../../service/memory/memory.player.service";
import {Router} from "@angular/router";
import {NgStyle} from "@angular/common";
import {ColorFader} from "../../utils";

@Component({
  selector: 'app-join.player',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './join.player.component.html',
  styleUrl: './join.player.component.css'
})
export class JoinPlayerComponent {
  players: Player[] = [];
  create = false;

  constructor(
    private playerService: PlayerReqService,
    private gameService: GameReqService,
    private memory: MemoryPlayerService,
    private router: Router
  ) {
    this.playerService.getPlayers().subscribe(players =>
      this.players = players.map(player => {
        player.fontColor = new ColorFader().getContrastColor(player.color);
        return player;
      })
    );
  }

  createPlayer(name: string) {
    this.playerService.createPlayer(new Player(NaN, name))
      .subscribe(player => {
        this.playerService.setColor(player.id, '#000000')
          .subscribe(() => {
            this.playerService.getPlayers()
              .subscribe(players => {
                  this.players = players.map(player => {
                    player.fontColor = new ColorFader().getContrastColor(player.color);
                    return player;
                  });
                  this.create = false;
                }
              );
          });
      });
  }

  selectPlayer(gId: string, pId: number) {
    if (gId) {
      this.gameService.addPlayerToGame(Number(gId), pId).subscribe(game => {
        this.memory.gameId = game.id;
        this.memory.playerId = pId;
        this.router.navigateByUrl("/idle")
      })
    }
  }
}
