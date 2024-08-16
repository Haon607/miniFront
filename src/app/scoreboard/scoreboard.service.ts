import { Injectable } from '@angular/core';
import { Player } from "../models";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScoreboardService {

  playerSubject = new Subject<Player[]>();
  totalSubject = new Subject<boolean>();

  constructor() {
    this.playerSubject.next([]);
    this.totalSubject.next(true);
  }

}
