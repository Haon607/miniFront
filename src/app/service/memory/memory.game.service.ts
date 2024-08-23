import { Injectable } from '@angular/core';
import { Player } from "../../models";

@Injectable({
  providedIn: 'root'
})
export class MemoryGameService {
  gameId: number = NaN;
  players: Player[] = [
    // new Player(0, "P0", 0, 0),
    // new Player(1, "P1", 1, 1),
    // new Player(2, "P2", 2, 2),
    // new Player(3, "P3", 3, 3),
    // new Player(4, "P4", 4, 4),
    // new Player(5, "P5", 5, 5),
    // new Player(6, "P6", 6, 6),
    // new Player(7, "P7", 7, 7),
    // new Player(8, "P8", 8, 8),
    // new Player(9, "P9", 9, 9),
    // new Player(10, "P10", 10, 10),
    // new Player(11, "P11", 11, 11),
    // new Player(12, "P12", 12, 12),
    // new Player(13, "P13", 13, 13),
    // new Player(14, "P14", 14, 14),
    // new Player(15, "P15", 15, 15),
    // new Player(16, "P16", 16, 16),
    // new Player(17, "P17", 17, 17),
    // new Player(18, "P18", 18, 18),
    // new Player(19, "P19", 19, 19),
  ];

  constructor() { }
}
