import { Component } from '@angular/core';
import { ScoreboardComponent } from "../../../scoreboard/scoreboard.component";

@Component({
  selector: 'app-simple.round.game',
  standalone: true,
  imports: [
    ScoreboardComponent
  ],
  templateUrl: './simple.round.game.component.html',
  styleUrl: './simple.round.game.component.css'
})
/**
 * This component is for 5 questions to the trivial pursuit categories,
 * the question data should look as follows:
 * QUESTION§CORRECTANSWER;OPTION1;OPTION2;OPTION3
 */
export class SimpleRoundGameComponent {

}
