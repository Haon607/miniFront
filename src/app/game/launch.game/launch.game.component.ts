import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-launch.game',
  standalone: true,
  imports: [],
  templateUrl: './launch.game.component.html',
  styleUrl: './launch.game.component.css'
})
export class LaunchGameComponent {
  constructor(private router: Router) {
  }

  launch() {
    this.router.navigateByUrl('/game/join');
  }
}
