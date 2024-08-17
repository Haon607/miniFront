import { Component } from '@angular/core';
import { SquaresService } from "../../squares/squares.service";

@Component({
  selector: 'app-rules.game',
  standalone: true,
  imports: [],
  templateUrl: './rules.game.component.html',
  styleUrl: './rules.game.component.css'
})
export class RulesGameComponent {
  constructor(
    private squares: SquaresService
  ) {
    // squares.wave('#FFFFFF', 1000, "vertical")
   this.x()
  }

  async x ()  {
    await this.squares.circle('#FF0000', 1000, 50);

  }
}
