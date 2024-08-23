import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Player } from "../../models";
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

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.url}/${id}`, {});
  }

  createPlayer(body: Player): Observable<Player> {
    return this.http.post<Player>(`${this.url}`, body);
  }

  setInput(id: number, input: String): Observable<Player> {
    return this.http.post<Player>(`${this.url}/${id}`, input);
  }

  deleteInputs(): Observable<Player[]> {
    return this.http.delete<Player[]>(`${this.url}`);
  }

  deleteInput(id: number): Observable<Player> {
    return this.http.delete<Player>(`${this.url}/${id}`);
  }
}
