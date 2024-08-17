import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Game, Player } from "../../models";

@Injectable({
  providedIn: 'root'
})
export class GameReqService {

  constructor(private http: HttpClient) { }

  private url: string = "http://localhost:8080/api/game";

  createGame(): Observable<Game> {
    return this.http.post<Game>(`${this.url}`, {});
  }

  addPlayerToGame(gameId: number, playerId: number): Observable<Game> {
    return this.http.put<Game>(`${this.url}/${gameId}/${playerId}`, {});
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.url}/${id}`, {});
  }
}
