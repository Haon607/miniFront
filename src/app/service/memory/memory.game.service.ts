import { Injectable } from '@angular/core';
import { Player } from "../../models";

@Injectable({
  providedIn: 'root'
})
export class MemoryGameService {
  gameId: number = NaN;
  players: Player[] = [];

  constructor() { }
}
