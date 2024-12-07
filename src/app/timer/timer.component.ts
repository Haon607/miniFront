import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  standalone: true,
  imports: [
    NgStyle
  ],
  animations: [
    trigger('scaleText', [
      state('normal', style({transform: 'scale(1)'})),
      state('scaled', style({transform: 'scale(1.2)'})),
      transition('normal <=> scaled', animate('200ms ease-in-out')),
    ]),
    trigger('flash', [
      state('normal', style({color: '{{ textColor }}'}), {params: {textColor: '#000'}}),
      state('flash', style({color: '{{ warningTextColor }}'}), {params: {warningTextColor: '#FF0000'}}),
      transition('normal <=> flash', animate('200ms ease-in-out')),
    ]),
  ]
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() initialTime: number = 60;
  @Input() warningThreshold: number = 10;
  @Input() progressBarColor: string = '#4CAF50';
  @Input() warningColor: string = '#FF0000';
  @Input() textColor: string = '#000';
  @Input() warningTextColor: string = '#FF0000';
  @Input() size: number = 100;

  @Output() currentSecond = new EventEmitter<number>();
  @Output() timerEnded = new EventEmitter<void>();

  timeLeft: number;
  intervalId: any;
  isRunning: boolean = false;
  scaleState: string = 'normal';
  flashState: string = 'normal';
  isWarning: boolean = false;

  constructor() {
    this.timeLeft = this.initialTime;
  }

  ngOnInit(): void {
    this.resetTimer();
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }

  startTimer() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.timeLeft -= 1;
      this.currentSecond.emit(this.timeLeft);

      if (this.timeLeft <= this.warningThreshold || this.timeLeft % 10 === 0) {
        // Trigger text scale animation
        this.scaleState = 'scaled';
        setTimeout(() => this.scaleState = 'normal', 200);
      }

      // Update isWarning and flash states based on the threshold
      if (this.timeLeft <= this.warningThreshold) {
        this.isWarning = true;
        this.flashState = this.flashState === 'normal' ? 'flash' : 'normal';
        new Audio("/audio/timer/running_out.mp3").play();
      } else {
        this.isWarning = false;
        this.flashState = 'normal';
      }

      // Handle timer end
      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.timerEnded.emit();
      }
    }, 1000);
  }

  stopTimer() {
    this.isRunning = false;
    this.clearInterval();
  }

  resetTimer() {
    this.stopTimer();
    this.timeLeft = this.initialTime;
    this.isWarning = false;
    this.flashState = 'normal';
  }

  modifyTimer(newTime: number) {
    this.timeLeft = newTime;
    if (this.isRunning && this.timeLeft > 0) {
      this.stopTimer();
      this.startTimer();
    }
  }

  private clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pipeTime(timeLeft: number) {
    const seconds = timeLeft % 60;
    const minutes = Math.floor(timeLeft / 60);
    return `${minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
  }
}
