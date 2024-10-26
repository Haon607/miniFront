import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScoreboardComponent } from "./scoreboard/scoreboard.component";
import { SquaresComponent } from "./squares/squares.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScoreboardComponent, SquaresComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'miniFront';
  protected readonly window = window;
}
