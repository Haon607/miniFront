import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Player } from "../models";
import { animate, style, transition, trigger } from "@angular/animations";
import { NgClass, NgStyle } from "@angular/common";
import { ColorFader } from "../utils";
import { ScoreboardService } from "./scoreboard.service";

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [
    NgStyle,
    NgClass
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css',
  animations: [
    trigger('slide-to-right', [
      transition('void => *', [
        style({
          position: "relative",
          left: "-1300px",
        }),
        animate('250ms ease-out', style({
          left: "0"
        })),
      ]),
      transition('* => void', [
        style({
          position: "relative",
          left: "0"
        }),
        animate('250ms ease-in', style({
          left: "-1300px"
        }))
      ])
    ])
  ]
})
export class ScoreboardComponent {
  @ViewChild('bodyElement') bodyElement!: ElementRef;
  isOverflowing = false;
  totalScore: boolean = true;
  players: Player[] = [];

  constructor(private scoreboardService: ScoreboardService) {
    scoreboardService.playerSubject.subscribe((players: Player[]) => {
      this.players = players.map(player => {
        player.fontColor = new ColorFader().getContrastColor(player.color);
        return player;
      });
      this.checkOverflow();
    })
    scoreboardService.totalSubject.subscribe((totalScore: boolean) => this.totalScore = totalScore)
    scoreboardService.sortSubject.subscribe(() => this.sort())
  }

  async sort() {
    const previousOrder = this.players.map(player => player.id);

    this.checkOverflow()

    for (let player of this.players) {
      player.hidden = true;
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    this.players.sort((a, b) => {
      if (this.totalScore) {
        return b.totalScore - a.totalScore;
      } else {
        return b.gameScore - a.gameScore;
      }
    });

    this.players.forEach((player, index) => {
      player.correct = false;
      const previousIndex = previousOrder.indexOf(player.id);
      if (previousIndex > index) {
        player.fontColor = '#99FF99';
      } else if (previousIndex < index) {
        player.fontColor = '#FF9999';
      } else {
        player.fontColor = '#999999';
      }
    });

    for (let player of this.players) {
      player.hidden = false;
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    for (let player of this.players) {
      new ColorFader().fadeColor(player.fontColor, new ColorFader().getContrastColor(player.color), 1000, (newColor) => player.fontColor = newColor);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkOverflow();
  }

  checkOverflow() {
    const bodyEl = this.bodyElement.nativeElement;
    this.isOverflowing = bodyEl.scrollHeight > bodyEl.clientHeight;
  }
}
