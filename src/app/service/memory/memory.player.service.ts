import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemoryPlayerService {
  gameId: number = /*NaN*/ 908;
  playerId: number = /*NaN*/ 52;

  constructor() { }
}
