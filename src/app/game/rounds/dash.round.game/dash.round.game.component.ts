import { Component, ViewChild } from '@angular/core';
import { ProgressBarComponent } from "../../../progress-bar/progress-bar.component";
import { ScoreboardComponent } from "../../../scoreboard/scoreboard.component";
import { TimerComponent } from "../../../timer/timer.component";
import { GameReqService } from "../../../service/request/game.req.service";
import { PlayerReqService } from "../../../service/request/player.req.service";
import { MemoryGameService } from "../../../service/memory/memory.game.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SquaresService } from "../../../squares/squares.service";
import { ScoreboardService } from "../../../scoreboard/scoreboard.service";
import { Game, Question, Round } from "../../../models";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-dash.round.game',
  standalone: true,
  imports: [
    ProgressBarComponent,
    ScoreboardComponent,
    TimerComponent
  ],
  templateUrl: './dash.round.game.component.html',
  styleUrl: './dash.round.game.component.css',
  animations: [trigger('slide', [transition('void => *', [style({
    position: "relative", right: "-1300px",
  }), animate('250ms ease-out', style({
    right: "0"
  })),]), transition('* => void', [style({
    position: "relative", left: "0"
  }), animate('250ms ease-in', style({
    left: "-1300px"
  }))])])]
})
export class DashRoundGameComponent {
  game: Game = new Game();
  round: Round = new Round();
  display: {
    title: string,
    definition: string,
    countdown: string,
    elementsLeft: number,
    elements: string[];
  } = { title: '', definition: '', countdown: '', elements: [], elementsLeft: NaN };
  list: {
    title: string,
    definition: string,
    elements: string[];
  } = { title: '', definition: '', elements: [] };
  timeSize: number = 0;
  stopBlinks = false;
  music = new Audio();
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;

  constructor(
    private gameService: GameReqService,
    private playerService: PlayerReqService,
    private memory: MemoryGameService,
    private router: Router,
    private route: ActivatedRoute,
    private squares: SquaresService,
    private scoreboard: ScoreboardService,
  ) {
    gameService.getGame(memory.gameId).subscribe(game => {
      this.game = game;
      this.round = game.rounds[Number(route.snapshot.paramMap.get('round')!) - 1];
    });
    this.round.questions = [new Question(NaN, "Spiele des Jahres§Alle Brett- und Gesellschaftsspiele, die zwischen 1979 und 2024 im Kontext des deutschen Spiel des Jahres-Preises gelistet wurden. Egal ob diese Gewonnen haben, nominiert wurden oder nur auf den Empfehlungs- bzw. Auswahllisten standen.§Giganten;Union Pacific;Carolus Magnus;Ohne Furcht und Adel;Das Amulett;Zapp Zerapp;Puerto Rico;Trans America;Clans;Die Dracheninsel;Dicke Luft in der Gruft;Einfach Genial;Raja;Sankt Petersburg;Himalaya;In 80 Tagen um die Welt;Jambo;Verflixxt!;Aqua Romana;Blue Moon City;Just 4 Fun;Seeräuber;Die Baumeister von Arkadia;Der Dieb von Bagdad;Jenseits von Theben;Yspahan;Blox;Stone Age;Suleika;Wie verhext;Fauna;Finca;Fits;Pandemie;Identik;A la carte;Im Wandel der Zeiten – Das Würfelspiel – Bronzezeit;Fresko;Asara;Die verbotene Insel;Eselsbrücke;Vegas;Qwixx;Augustus;Concept;Splendor;Machi Koro;The Game;Imhotep;Karuba;Magic Maze;Wettlauf nach El Dorado;Luxor;The Mind;Lama;Werwörter;My City;Nova Luna;Die Abenteuer des Robin Hood;Zombie Teenz Evolution;Scout;Top Ten;Fun Facts;Next Station: London;Captain Flip;Auf den Wegen von Darwin;Hase und Igel;Rummikub;Focus;Sagaland;Scotland Yard;Dampfross;Sherlock Holmes Criminal-Cabinet;Heimlich & Co.;Auf Achse;Barbarossa und die Rätselmeister;Café International;Adel verpflichtet;Drunter & Drüber;Um Reifenbreite;Bluff;Manhattan;Die Siedler von Catan;El Grande;Mississippi Queen;Elfenland;Tikal;Torres;Carcassonne;Villa Paletti;Alhambra;Zug um Zug;Niagara;Thurn und Taxis;Zooloretto;Keltis;Dominion;Dixit;Qwirkle;Kingdom Builder;Hanabi;Camel Up;Colt Express;Codenames;Kingdomino;Azul;Just One;Pictures;MicroMacro: Crime City;Cascadia;Dorfromantik – Das Brettspiel;Sky Team;Der Palast von Alhambra;Clans;Die Dracheninsel;Amun-Re;Attribute;Ballon Cup;Coloretto;Die Werwölfe von Düsterwald;Edel, Stein & Reich;Fische Fluppen Frikadellen;Paris Paris;Richelieu und die Königin!;Rumis;Villa Paletti;Alles im Eimer;Atlantic Star;Blokus;Der Herr der Ringe: Die Gefährten – Das Kartenspiel;Dschunke;Dvonn;Kupferkessel Co.;Magellan;Puerto Rico;San Gimignano;Trans America;Carcassonne;Babel;Capitol;Cartagena;Das Amulett;Die Händler von Genua;Drachendelta;Ebbe und Flut;Hexenrennen;Land unter;Royal Turf;San Marco;Zapp Zerapp;Torres;Carolus Magnus;Kardinal;Kardinal & König;La Città;Metro;Ohne Furcht und Adel;Port Royal;Tadsch Mahal;Vinci;Zèrtz;Zoff im Zoo;Tikal;Chinatown;El Caballero;Giganten;Kahuna;Kontor;Mamma Mia!;Money!;TaYü;Union Pacific;Verräter;Elfenland;Basari;Caesar & Cleopatra;Canyon;David & Goliath;Die Macher;Durch die Wüste;Euphrat & Tigris;Gipf;Minister;Tonga Bonga;Tycoon;Mississippi Queen;Bohnanza;Comeback;Die Siedler von Catan – Das Kartenspiel;Dimenticato;Expedition;Löwenherz;Manitou;Showmanager;Visionary;El Grande;Ab die Post!;Campanile;Mü & mehr;Reibach & Co;Sisimizi;Speed;Top Race;Wat’n dat!?;Word-Whiz;Die Siedler von Catan;Buzzle;Condottiere;Die Maulwurf-Company;Galopp Royal;Kaleidos;La-Trel;Linie 1;Medici;Manhattan;6 nimmt!;Billabong;Die Osterinsel;Kohle, Kies & Knete;Take it easy;Was sticht?;Bluff;Modern Art;Pusher;Quarto!;Rheingold;Spiel der Türme;Tutanchamun;Zatre;Um Reifenbreite;Die verbotene Stadt;Donnerwetter;Entenrallye;Gold Connection;Palermo;Quo vadis?;Razzia;Schraumeln;Tabu;Drunter & Drüber;20 Questions;Bauernschlau;Casablanca;Formica;Im Reich des weißen Bären;Invers;Irrgendwie;Adel verpflichtet;Das Geheimnis der Pyramide;Die heiße Schlacht am kalten Buffet;Dino;Favoriten;Heuchel & Meuchel;Lancelot;New Orleans Big Band;Tabaijana;Café International;Abalone;Der Ausreißer;Ein solches Ding;Flieg Dumbo flieg;Hexentanz;Maestro;Mitternachtsparty;Pole Position;Regatta;Barbarossa und die Rätselmeister;Bausack;Forum Romanum;Hol’s der Geier;Janus;Loa;Mississippi;Scalino;Schoko & Co;Targui;Auf Achse;Der fliegende Teppich;Die 1. Million;Kreml;Maritim;Restaurant;Sauerbaum;Shark;Heimlich & Co;Code 777;Das verrückte Labyrinth;Greyhounds;Malawi;TOP;Top Secret;Winkeladvokat;Sherlock Holmes Criminal-Cabinet;Abilene;Campus;Cash & Carry;Heimlich & Co;Jago;Kuhhandel;Mister Zero;Pin;Dampfross;Claim;Attika;Carcassonne – Die Burg;Coyote;Da Vinci Code;Die sieben Siegel;Dos Rios;Im Wassergarten;Kai Piranja;Kakerlakenpoker;Mausen;Maya;Oase;San Juan;Tom Tube;Versunkene Stadt;Viele Dinge;Viva il Re!;Yinsh;Boomtown;Diamant;Die Gärten der Alhambra;Funkenschlag;Geschenkt … ist noch zu teuer!;Piranha Pedro;Tanz der Hornochsen;Typo;Wie ich die Welt sehe;Ausgerechnet Buxtehude;Fettnapf ... in Sicht;Fischmarkt;Hart an der Grenze;Mesopotamien;Packeis am Pol;Revolte in Rom;Timbuktu;Was'n das?;Alchemist;Burg Appenzell;Der Prestel Kunstmarkt;Die Säulen der Erde;Die Säulen von Venedig;Imperial;Jetzt schlägt’s 13;Notre Dame;Skybridge;The Kaleidoscope Classic;Wikinger;Würfel-Bingo;Big Points;Die hängenden Gärten;Flinke Feger;Galaxy Trucker;Im Jahr des Drachen;Jamaica;Kakerlakensalat;Lascaux;Linq;Metropolys;Pingu-Party;Tzaar;Cities;Diamonds Club;Einauge sei wachsam;Maori;Mow;Poison;Valdora;Zack & Pack;Don Quixote;Hansa Teutonica;Jaipur;Jäger und Sammler;Kamisado;Level X;Magister Navis;Mosaix;Samarkand;Tobago;Geistesblitz;Blockers!;Uluru;Mondo;Skull & Roses;Safranito;Sun, Sea & Sand;Die Burgen von Burgund;Luna;Freeze;Drecksau;Indigo;Kalimambo;Miss Lupun und das Geheimnis der Zahlen;Kulami;Santa Cruz;Pictomania;Rapa Nui;Divinare;Escape – Der Fluch des Tempels;Hand aufs Herz;La Boca;Libertalia;Mixtour;Riff Raff;Rondo;Yay!;Voll Schaf;SOS Titanic;Love Letter;Potato Man;Sanssouci;Cacao;Loony Quest;Patchwork;Simsala… Bumm?;Ugo!;Vollmondnacht;Agent Undercover;Animals on Board;Die fiesen 7;Krazy Wordz;Qwinto;Deja-Vu;Dodelido;Fabelsaft;Klask;Shiftago;Tempel des Schreckens;Word Slam;5-Minute Dungeon;Facecards;Majesty;Memoarrr!;Santorini;Woodlands;Belratti;Dizzle;Imhotep: Das Duell;Krasse Kacke;Reef;Sherlock;Color Brain;Der Fuchs im Wald;Draftosaurus;Kitchen Rush;Little Town;Spicy;Biss 20;Chakra;Punktesalat;Switch & Signal;The Key – Sabotage im Lucky Lama Land;7 Wonders: Architects;Echoes: Die Tänzerin;Magic Rabbit;My Gold Mine;So Kleever!;Trek 12: Himalaja;Akropolis;Hitster;Kuzooka;Mantis;QE;Sea Salt & Paper;That’s Not a Hat;Ghost Writer;Harmonies;Passt nicht!;Schätz it if you can;Trekking – Reise durch die Zeit;Trio")]
    // this.startRound(); //TODO DEBUG Shift one up
    this.initScoreboard();
  }

  async initScoreboard() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.scoreboard.playerSubject.next(this.memory.players);
    this.scoreboard.totalSubject.next(false);
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.scoreboard.sortSubject.next();
  }

  async startRound() {
    this.round.questions = this.squares.shuffleArray(this.round.questions);
    this.round.questions = this.round.questions.slice(0, 1);
    this.list = {
      title: this.round.questions[0].data.split('§')[0],
      definition: this.round.questions[0].data.split('§')[1],
      elements: this.round.questions[0].data.split('§')[2].split(';'),
    };
    this.music = new Audio('/audio/rounds/dash/dash_intro.mp3');
    this.music.addEventListener('ended', () => {
      this.startGame();
    });
    this.music.play();
    await this.playStartAnimation();
    this.stopBlinks = false;
    this.startBlinks();
    this.display.title = this.list.title;
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.display.definition = this.list.definition;
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.display.elementsLeft = 0;
    for (let element of this.list.elements) {
      this.display.elementsLeft++;
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  onTimerEnd() {

  }

  private async playStartAnimation() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.squares.verticalLine(3, '#feca35', 500, 10, 1, true)
    this.squares.verticalLine(4, '#feca35', 500, 10, 1, true)
    this.squares.verticalLine(5, '#feca35', 500, 10, 1, true)
    this.squares.verticalLine(6, '#feca35', 500, 10, 1, true)
    await new Promise(resolve => setTimeout(resolve, 500));
    this.squares.verticalLine(0, '#268168', 1000, 10, 1, false, true)
    this.squares.verticalLine(1, '#268168', 1000, 10, 1, false, true)
    this.squares.verticalLine(8, '#268168', 1000, 10, 1, false, true)
    this.squares.verticalLine(9, '#268168', 1000, 10, 1, false, true)
    await new Promise(resolve => setTimeout(resolve, 1350));
    this.squares.colorSquares([[0, 7],[1, 7],[2, 7],[3, 7],[4, 7],[5, 7],[6, 7],[7, 7],[8, 7],[9, 7],[0, 2],[1, 2],[2, 2],[3, 2],[4, 2],[5, 2],[6, 2],[7, 2],[8, 2],[9, 2]], '#175564')
    await new Promise(resolve => setTimeout(resolve, 100));
    this.squares.colorSquares([[0, 7],[1, 7],[2, 7],[3, 7],[4, 7],[5, 7],[6, 7],[7, 7],[8, 7],[9, 7],[0, 2],[1, 2],[2, 2],[3, 2],[4, 2],[5, 2],[6, 2],[7, 2],[8, 2],[9, 2]], '#5a3735')
    await new Promise(resolve => setTimeout(resolve, 200));
    this.squares.colorSquares([[0, 7],[1, 7],[2, 7],[3, 7],[4, 7],[5, 7],[6, 7],[7, 7],[8, 7],[9, 7],[0, 2],[1, 2],[2, 2],[3, 2],[4, 2],[5, 2],[6, 2],[7, 2],[8, 2],[9, 2]], '#173a46')
    await new Promise(resolve => setTimeout(resolve, 150));
    this.squares.colorSquares([[0, 7],[1, 7],[2, 7],[3, 7],[4, 7],[5, 7],[6, 7],[7, 7],[8, 7],[9, 7],[0, 2],[1, 2],[2, 2],[3, 2],[4, 2],[5, 2],[6, 2],[7, 2],[8, 2],[9, 2]], '#3b202a')
    await new Promise(resolve => setTimeout(resolve, 100));
    this.squares.allFade('#191725', 500)
    await new Promise(resolve => setTimeout(resolve, 850));
    this.squares.all('#175564')
    this.squares.allFade('#142b45', 1000)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async startBlinks() {
    let seq = this.squares.shuffleArray(this.squares.allPath);
    for (let i = 0; !this.stopBlinks; i++) {
      this.squares.colorSquares([seq[i%100]], '#268168')
      this.squares.fadeSquares([seq[i%100]], '#142b45', 1000)
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async startGame() {
    this.showResults();
    this.music.pause();
    this.music = new Audio('/audio/rounds/dash/dash_play.mp3');
    this.music.play()
    this.stopBlinks = true;
    this.display.definition = '';
    this.display.countdown = "ACHTUNG"
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 25));
      this.timeSize += 5
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.display.countdown = "3"
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.display.countdown = "2"
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.display.countdown = "1"
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.display.countdown = "LOS"
    this.timerComponent.startTimer()
    this.playerService.deleteInputs().subscribe(() => {})
      this.gameService.modifyData(this.memory.gameId, "/text", this.list.title).subscribe(() => {})
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.display.countdown = ""

  }

  private async showResults() {
    await new Promise(resolve => setTimeout(resolve, 127500));

  }
}
