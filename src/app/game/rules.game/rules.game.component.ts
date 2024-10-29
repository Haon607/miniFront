import {Component} from '@angular/core';
import {SquaresService} from "../../squares/squares.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MemoryGameService} from "../../service/memory/memory.game.service";
import {GameReqService} from "../../service/request/game.req.service";

@Component({
  selector: 'app-rules.game',
  standalone: true,
  imports: [],
  templateUrl: './rules.game.component.html',
  styleUrl: './rules.game.component.css'
})
export class RulesGameComponent {
  displayHints: boolean = false;
  rulesMusic = new Audio();
  roundNumber = '';

  constructor(
    private squares: SquaresService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private memory: MemoryGameService,
    private gameService: GameReqService,
  ) {
    this.roundNumber = activatedRoute.snapshot.paramMap.get('round')!;

    gameService.modifyData(memory.gameId, '/rules/' + this.roundNumber).subscribe(() => {});
    this.displayHints = false;

    this.rulesMusic.src = '/audio/rules.mp3';
    this.rulesMusic.play();
    this.startAnimation();
    this.rulesMusic.addEventListener('ended', () => {
      // this.skipToNext();
    });

  }

  private async startAnimation() {

  }

  skipToNext() {
    this.rulesMusic.pause();
    this.rulesMusic.currentTime = 0;
    this.router.navigateByUrl(`/game/round/${this.roundNumber}`)
  }
}
