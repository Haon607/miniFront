import { Component, Input, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
  standalone: true,
  imports: [NgStyle]
})
export class ProgressBarComponent implements OnInit {
  @Input() currentProgress: number = 0;
  @Input() maxProgress: number = 5;
  @Input() progressBarColor: string = '#4CAF50';
  @Input() warningColor: string = '#FF0000';
  @Input() warningThreshold: number = 1; // Sets threshold for warning state
  @Input() size: number = 200; // Width of the progress bar
  @Input() textColor: string = '#000000';

  progressWidth: number = 0;
  isWarning: boolean = false;

  ngOnInit(): void {
    this.updateProgress();
  }

  ngOnChanges(): void {
    this.updateProgress();
  }

  modifyProgress(by: number): void {
    this.currentProgress += by;
    this.updateProgress();
  }

  private updateProgress() {
    this.progressWidth = (this.currentProgress / this.maxProgress) * 100;
    this.isWarning = this.maxProgress - this.currentProgress <= this.warningThreshold;
  }
}
