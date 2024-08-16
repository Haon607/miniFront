import {Routes} from '@angular/router';
import {JoinPlayerComponent} from "./player/join.player/join.player.component";
import {JoinGameComponent} from "./game/join.game/join.game.component";
import {LaunchGameComponent} from "./game/launch.game/launch.game.component";

export const routes: Routes = [
  {path: "", component: JoinPlayerComponent},
  {path: "game", component: LaunchGameComponent},
  {path: "game/join", component: JoinGameComponent},
];
