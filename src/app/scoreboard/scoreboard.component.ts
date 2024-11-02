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
        player.textBg = ['#00000000', '#00000000']
        player.fontColor = ColorFader.getContrastColor(player.color);
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
        this.runSortedAnim(player, 'up');
      } else if (previousIndex < index) {
        this.runSortedAnim(player, 'down');
      } else {
        this.runSortedAnim(player, 'same');
      }
    });

    for (let player of this.players) {
      player.hidden = false;
      await new Promise(resolve => setTimeout(resolve, 50));
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

  private async runSortedAnim(player: Player, dir: 'up' | 'down' | 'same') {
    for (let i = 0; i < 6; i++)
    if (dir === 'same') {
      // player.textBg[0] = '#FFFFFF99'
      // player.textBg[1] = '#FFFFFF99'
      // await new Promise(resolve => setTimeout(resolve, 250));
      // player.textBg[0] = '#00000000'
      // player.textBg[1] = '#00000000'
      // await new Promise(resolve => setTimeout(resolve, 250));
    } else if (dir === 'up') {
      player.textBg[1] = '#00FF0099'
      await new Promise(resolve => setTimeout(resolve, 100));
      player.textBg[0] = '#00FF0099'
      await new Promise(resolve => setTimeout(resolve, 150));
      player.textBg[1] = '#00000000'
      await new Promise(resolve => setTimeout(resolve, 100));
      player.textBg[0] = '#00000000'
      await new Promise(resolve => setTimeout(resolve, 150));
    } else if (dir === 'down') {
      player.textBg[0] = '#FF000099'
      await new Promise(resolve => setTimeout(resolve, 100));
      player.textBg[1] = '#FF000099'
      await new Promise(resolve => setTimeout(resolve, 150));
      player.textBg[0] = '#00000000'
      await new Promise(resolve => setTimeout(resolve, 100));
      player.textBg[1] = '#00000000'
      await new Promise(resolve => setTimeout(resolve, 150));
    }
  }
}
