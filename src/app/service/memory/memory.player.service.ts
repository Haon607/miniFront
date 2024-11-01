import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemoryPlayerService {
  gameId: number = /*NaN*/ 855;
  playerId: number = /*NaN*/ 52;
  color: string = '';

  constructor() { }
}
