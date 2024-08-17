import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemoryGameService {
  gameId: number = NaN;

  constructor() { }
}
