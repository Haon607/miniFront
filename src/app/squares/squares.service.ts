import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ColorFader} from "../utils";

@Injectable({
  providedIn: 'root',
})
export class SquaresService {
  squares: BehaviorSubject<string[][]>;
  private squaresData: string[][];

  constructor() {
    this.squaresData = Array.from({length: 10}, () => Array(10).fill('#000080'));
    this.squares = new BehaviorSubject<string[][]>(this.squaresData);
  }

  all(color: string) {
    this.squaresData = this.squaresData.map(row => row.map(() => color));
    this.squares.next(this.squaresData);
  }

  allFade(color: string, time: number) {
    this.squaresData.forEach((row, rowIndex) => {
      row.forEach((_, colIndex) => {
        this.fadeAndUpdate(rowIndex, colIndex, color, time);
      });
    });
  }

  async colorSquares(coords: number[][], color: string) {
    coords.forEach(([rowIndex, colIndex]) => {
      this.squaresData[rowIndex][colIndex] = color;
    });
    this.squares.next([...this.squaresData]);
  }

  async fadeSquares(coords: number[][], color: string, time: number) {
    coords.forEach(([rowIndex, colIndex]) => {
      this.fadeAndUpdate(rowIndex, colIndex, color, time);
    });
  }

  colorEdges(color: string) {
    const edgeCoords = this.getEdgeCoords();
    this.colorSquares(edgeCoords, color);
  }

  fadeEdges(color: string, time: number) {
    const edgeCoords = this.getEdgeCoords();
    this.fadeSquares(edgeCoords, color, time);
  }

  private getEdgeCoords(): number[][] {
    let coords: number[][] = [];

    // Top edge
    for (let col = 0; col < 10; col++) {
      coords.push([0, col]);
    }

    // Bottom edge
    for (let col = 0; col < 10; col++) {
      coords.push([9, col]);
    }

    // Left edge
    for (let row = 1; row < 9; row++) {
      coords.push([row, 0]);
    }

    // Right edge
    for (let row = 1; row < 9; row++) {
      coords.push([row, 9]);
    }

    return coords;
  }

  async allVerticalLine(color: string, time: number, tailLength: number, repeats: number = 1, fadeBack: boolean = true, alt: boolean = false, altColor: string = color) {
    for (let col = 0; col < 10; col++) {
      this.verticalLine(col, col % 2 === 0 ? color : altColor, time, tailLength, repeats, fadeBack, alt);
    }
  }

  async verticalLine(col: number, color: string, time: number, tailLength: number, repeats: number = 1, fadeBack: boolean = true, alt: boolean = false) {
    let path = [
      [0, col], [1, col], [2, col], [3, col], [4, col], [5, col], [6, col], [7, col], [8, col], [9, col]
    ]
    if (alt) {
      path = path.reverse();
    }
    await this.anyPath(path, color, time, tailLength, repeats, fadeBack);
  }


  async allLine(color: string, time: number, tailLength: number, repeats: number = 1, fadeBack: boolean = true, alt: boolean = false, altColor: string = color) {
    for (let row = 0; row < 10; row++) {
      this.line(row, row % 2 === 0 ? color : altColor, time, tailLength, repeats, fadeBack, alt && row % 2 === 0);
    }
  }

  async line(row: number, color: string, time: number, tailLength: number, repeats: number = 1, fadeBack: boolean = true, alt: boolean = false) {
    let path = [
      [row, 0], [row, 1], [row, 2], [row, 3], [row, 4], [row, 5], [row, 6], [row, 7], [row, 8], [row, 9]
    ]
    if (alt) {
      path = path.reverse();
    }
    await this.anyPath(path, color, time, tailLength, repeats, fadeBack);
  }

  async circle(color: string, time: number, tailLength: number, repeats: number = 1, fadeBack: boolean = true) {
    let path = [
      [0, 5], [0, 6], [0, 7], [0, 8], [0, 9],
      [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9],
      [9, 8], [9, 7], [9, 6], [9, 5], [9, 4], [9, 3], [9, 2], [9, 1], [9, 0],
      [8, 0], [7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0],
      [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
    ]
    await this.anyPath(path, color, time, tailLength, repeats, fadeBack);
  }

  async randomPath(color: string, time: number, tailLength: number, repeats: number = 1, fadeBack: boolean = true) {
    let path = this.shuffleArray(this.allPath);
    await this.anyPath(path, color, time, tailLength, repeats, fadeBack);
  }

  async anyPath(path: number[][], color: string, time: number, tailLength: number, repeats: number = 1, fadeBack: boolean = true) {
    for (let i = 0; i < repeats; i++) {
      for (const coords of path) {
        let prevColor = this.squaresData[coords[0]][coords[1]];
        this.squaresData[coords[0]][coords[1]] = color;
        if (fadeBack) {
          this.fadeAndUpdate(coords[0], coords[1], prevColor, time)
        }
        await new Promise(resolve => setTimeout(resolve, time / tailLength));
      }
    }
  }

  private fadeAndUpdate(rowIndex: number, colIndex: number, color: string, time: number) {
    const startColor = this.squaresData[rowIndex][colIndex];
    new ColorFader().fadeColorSquare(startColor, color, time, (newColor) => {
      this.squaresData[rowIndex][colIndex] = newColor;
      this.squares.next([...this.squaresData]);
    });
  }

  shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements at indices i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  checkerPath = [
    [1, 0], [1, 2], [1, 4], [1, 6], [1, 8],
    [2, 1], [2, 3], [2, 5], [2, 7], [2, 9],
    [3, 0], [3, 2], [3, 4], [3, 6], [3, 8],
    [4, 1], [4, 3], [4, 5], [4, 7], [4, 9],
    [5, 0], [5, 2], [5, 4], [5, 6], [5, 8],
    [6, 1], [6, 3], [6, 5], [6, 7], [6, 9],
    [7, 0], [7, 2], [7, 4], [7, 6], [7, 8],
    [8, 1], [8, 3], [8, 5], [8, 7], [8, 9]];
  checkerPathInv = [
    [1, 1], [1, 3], [1, 5], [1, 7], [1, 9],
    [2, 0], [2, 2], [2, 4], [2, 6], [2, 8],
    [3, 1], [3, 3], [3, 5], [3, 7], [3, 9],
    [4, 0], [4, 2], [4, 4], [4, 6], [4, 8],
    [5, 1], [5, 3], [5, 5], [5, 7], [5, 9],
    [6, 0], [6, 2], [6, 4], [6, 6], [6, 8],
    [7, 1], [7, 3], [7, 5], [7, 7], [7, 9],
    [8, 0], [8, 2], [8, 4], [8, 6], [8, 8]];

  allPath = [
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9],
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9],
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9],
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9],
    [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9],
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9],
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9],
    [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], [7, 9],
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9],
    [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9]
  ];
}
