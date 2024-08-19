import {Routes} from '@angular/router';
import {JoinPlayerComponent} from "./player/join.player/join.player.component";
import {JoinGameComponent} from "./game/join.game/join.game.component";
import {LaunchGameComponent} from "./game/launch.game/launch.game.component";
import { IdlePlayerComponent } from "./player/idle.player/idle.player.component";
import { PlayerIntroGameComponent } from "./game/player-intro.game/player-intro.game.component";
import { RulesGameComponent } from "./game/rules.game/rules.game.component";
import { RulesPlayerComponent } from "./player/rules.player/rules.player.component";
import { FirstRoundGameComponent } from "./game/rounds/first.round.game/first.round.game.component";
import { SelectPlayerComponent } from "./player/select.player/select.player.component";
import {ScoreboardPlayerComponent} from "./player/scoreboard.player/scoreboard.player.component";
import {ScoreboardGameComponent} from "./game/scoreboard.game/scoreboard.game.component";

export const routes: Routes = [
  {path: "", component: JoinPlayerComponent},
  {path: "idle", component: IdlePlayerComponent},
  {path: "rules/:round", component: RulesPlayerComponent},
  {path: "select", component: SelectPlayerComponent},
  {path: "scoreboard/:round", component: ScoreboardPlayerComponent},
  //---{atop: player routes | below: game routes}---
  {path: "game", component: LaunchGameComponent},
  {path: "game/join", component: JoinGameComponent},
  {path: "game/players", component: PlayerIntroGameComponent},
  {path: "game/rules/:round", component: RulesGameComponent},
  {path: "game/round/1", component: FirstRoundGameComponent},
  {path: "game/scoreboard/:round", component: ScoreboardGameComponent},
];
