import {Routes} from '@angular/router';
import {JoinPlayerComponent} from "./player/join.player/join.player.component";
import {JoinGameComponent} from "./game/join.game/join.game.component";
import {LaunchGameComponent} from "./game/launch.game/launch.game.component";
import { IdlePlayerComponent } from "./player/idle.player/idle.player.component";
import { PlayerIntroGameComponent } from "./game/player-intro.game/player-intro.game.component";

export const routes: Routes = [
  {path: "", component: JoinPlayerComponent},
  {path: "idle", component: IdlePlayerComponent},
  {path: "game", component: LaunchGameComponent},
  {path: "game/join", component: JoinGameComponent},
  {path: "game/players", component: PlayerIntroGameComponent},
];
