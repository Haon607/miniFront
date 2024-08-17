import { Component } from '@angular/core';
import { NgForOf, NgStyle } from "@angular/common";
import { SquaresService } from "./squares.service";

@Component({
  selector: 'app-squares',
  standalone: true,
  imports: [
    NgStyle,
    NgForOf
  ],
  templateUrl: './squares.component.html',
  styleUrl: './squares.component.css'
})
export class SquaresComponent {
  squares: string[][] = [];

  constructor(
    private squareService: SquaresService,
  ) {
    squareService.squares.subscribe(squares => this.squares = squares);
  }
}
