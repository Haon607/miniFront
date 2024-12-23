import { Router } from "@angular/router";
import { MemoryPlayerService } from "../service/memory/memory.player.service";
import { GameReqService } from "../service/request/game.req.service";

export class PlayerRouting {
  async routIf(router: Router, memory: MemoryPlayerService, gameService: GameReqService) {
    let loop = true;
    // if (isNaN(memory.gameId)) {
    //   router.navigateByUrl("/");
    // }
    while (loop) {
      gameService.getGame(memory.gameId).subscribe(game => {
        if (game.route !== router.url) {
          router.navigateByUrl(game.route);
          loop = false;
        }
      });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}
