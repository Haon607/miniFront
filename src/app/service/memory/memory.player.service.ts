import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemoryPlayerService {
  gameId: number = NaN;
  playerId: number = NaN;

  constructor() { }
}
