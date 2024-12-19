import { Routes } from '@angular/router';
import { JoinPlayerComponent } from "./player/join.player/join.player.component";
import { JoinGameComponent } from "./game/join.game/join.game.component";
import { LaunchGameComponent } from "./game/launch.game/launch.game.component";
import { IdlePlayerComponent } from "./player/idle.player/idle.player.component";
import { PlayerIntroGameComponent } from "./game/player-intro.game/player-intro.game.component";
import { RulesGameComponent } from "./game/rules.game/rules.game.component";
import { RulesPlayerComponent } from "./player/rules.player/rules.player.component";
import { SelectPlayerComponent } from "./player/rounds/select.player/select.player.component";
import { ScoreboardPlayerComponent } from "./player/scoreboard.player/scoreboard.player.component";
import { ScoreboardGameComponent } from "./game/scoreboard.game/scoreboard.game.component";
import { SelectGameComponent } from "./game/select.game/select.game.component";
import { SimpleRoundGameComponent } from "./game/rounds/simple.round.game/simple.round.game.component";
import {
  SoundSequenceRoundGameComponent
} from "./game/rounds/sound-sequence.round.game/sound-sequence.round.game.component";
import {
  SoundSequenceRoundPlayerComponent
} from "./player/rounds/sound-sequence.round.player/sound-sequence.round.player.component";
import { DashRoundGameComponent } from "./game/rounds/dash.round.game/dash.round.game.component";
import { TextRoundPlayerComponent } from "./player/rounds/text.round.player/text.round.player.component";

export const routes: Routes = [
  {path: "", component: JoinPlayerComponent},
  {path: "idle", component: IdlePlayerComponent},
  {path: "initial", component: IdlePlayerComponent},
  {path: "selectgame", component: IdlePlayerComponent},
  {path: "rules/:round", component: RulesPlayerComponent},
  {path: "select", component: SelectPlayerComponent},
  {path: "sound", component: SoundSequenceRoundPlayerComponent},
  {path: "text", component: TextRoundPlayerComponent},
  {path: "dash", component: TextRoundPlayerComponent},
  {path: "scoreboard/:round", component: ScoreboardPlayerComponent},
  //---{atop: player routes | below: game routes}---
  {path: "game", component: LaunchGameComponent},
  {path: "game/join", component: JoinGameComponent},
  {path: "game/players", component: PlayerIntroGameComponent},
  {path: "game/select/:round", component: SelectGameComponent},
  {path: "game/rules/:round", component: RulesGameComponent},
  {path: "game/scoreboard/:round", component: ScoreboardGameComponent},
  {path: "game/round/simple/:round", component: SimpleRoundGameComponent},
  {path: "game/round/sounds/:round", component: SoundSequenceRoundGameComponent},
  {path: "game/round/dash/:round", component: DashRoundGameComponent},
];
