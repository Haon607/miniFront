import { Component } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { Player } from "../../models";
import { ScoreboardComponent } from "../../scoreboard/scoreboard.component";

@Component({
  selector: 'app-join.game',
  standalone: true,
  imports: [
    ScoreboardComponent
  ],
  templateUrl: './join.game.component.html',
  styleUrl: './join.game.component.css'
})
export class JoinGameComponent {
  joinAble = false;

  constructor() {
    let startMusic = new Audio('/audio/start.mp3');
    startMusic.play();
    startMusic.addEventListener('ended', () => {
      // this.joinAble = true;
    });
    this.joinAble = true; //DEBUG

  }
}
