import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Player } from "../models";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerReqService {

  constructor(private http: HttpClient) { }

  private url: string = "http://localhost:8080/api/players";

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.url}`, {});
  }

  createPlayer(body: Player): Observable<Player> {
    return this.http.post<Player>(`${this.url}`, body);
  }
}
