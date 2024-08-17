import {Routes} from '@angular/router';
import {JoinPlayerComponent} from "./player/join.player/join.player.component";
import {JoinGameComponent} from "./game/join.game/join.game.component";
import {LaunchGameComponent} from "./game/launch.game/launch.game.component";
import { IdlePlayerComponent } from "./player/idle.player/idle.player.component";

export const routes: Routes = [
  {path: "", component: JoinPlayerComponent},
  {path: "player/idle", component: IdlePlayerComponent},
  {path: "game", component: LaunchGameComponent},
  {path: "game/join", component: JoinGameComponent},
];
