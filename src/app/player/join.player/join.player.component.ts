import { Component } from '@angular/core';
import { Player } from "../../models";
import { PlayerReqService } from "../../service/player.req.service";

@Component({
  selector: 'app-join.player',
  standalone: true,
  imports: [],
  templateUrl: './join.player.component.html',
  styleUrl: './join.player.component.css'
})
export class JoinPlayerComponent {
  players: Player[] = [];
  create = false;

  constructor(private playerService: PlayerReqService) {
    this.playerService.getPlayers().subscribe(players => this.players = players);
  }

  createPlayer(name: string) {
    this.playerService.createPlayer(new Player(NaN, name, NaN, 0)).subscribe(() => this.playerService.getPlayers().subscribe(players => {
      this.players = players;
      this.create = false;
    }));
  }

  selectPlayer(id: number) {

  }
}
