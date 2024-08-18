import { Component } from '@angular/core';
import { SquaresService } from "../../squares/squares.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MemoryGameService } from "../../service/memory/memory.game.service";
import { GameReqService } from "../../service/request/game.req.service";

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

  constructor(
    private squares: SquaresService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private memory: MemoryGameService,
    private gameService: GameReqService,
  ) {
    gameService.modifyData(memory.gameId, '/rules/' + activatedRoute.snapshot.paramMap.get('round')).subscribe();
    this.displayHints = false;
    switch (activatedRoute.snapshot.paramMap.get('round')) {
      case '1':
        this.rulesMusic.src = '/audio/rules1.mp3';
        this.rulesMusic.play();
        this.startAnimation1();
        this.rulesMusic.addEventListener('ended', () => {
          // this.skipToNext();
        });
        break;
      case '2':
        break;
      case '3':
        break;
    }

  }

  private async startAnimation1() {
    await this.squares.circle('#3333FF', 200, 10, 2);
    await new Promise(resolve => setTimeout(resolve, 250));
    this.displayHints = true;
    await this.squares.all('#3333FF');
    await this.squares.allFade('#000080', 5000);
  }

  skipToNext() {
    this.rulesMusic.pause();
    this.rulesMusic.currentTime = 0;
    switch (this.activatedRoute.snapshot.paramMap.get('round')) {
      case '1':
        this.router.navigateByUrl('/game/round1')
        break;
      case '2':
        break;
      case '3':
        break;
    }
  }
}
