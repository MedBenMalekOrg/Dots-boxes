import {Injectable} from '@angular/core';
import {Firestore, collection, addDoc, doc, updateDoc, getDoc, docSnapshots} from '@angular/fire/firestore';
import {GameService} from './game.service';
import {Game, GameInterface} from './Game.model';
import {Router} from '@angular/router';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private firestore: Firestore,
              private gameService: GameService,
              private router: Router) {
  }

  async createGame(data: GameInterface) {
    try {
      const game = new Game(data);
      const docRef = await addDoc(collection(this.firestore, "games"), game.toJSON());
      game.id = docRef.id;
      this.gameService.setGame(game);
      ApiService.savePlayerLocal(game.creator);
      await this.router.navigate([docRef.id]);
    } catch (e) {
      console.error(e);
      await this.router.navigate(['']);
      this.gameService.setModal({
        header: '¡Ouups!',
        text: e as string || 'something happened! Please try again latter'
      });
    }
  }

  async addPlayer(data: Game, name: string) {
    ApiService.savePlayerLocal(name);
    const game = data.toJSON() as GameInterface;
    const docRef = doc(this.firestore, "games", data.id);
    await updateDoc(docRef, {
      players: {
        ...game.players,
        [name as string]: {
          score: 0,
          turn: false,
          color: data.colors[Object.keys(game.players).length],
          name
        }
      }});
  }

  async updateGame(data: Game) {
    const docRef = doc(this.firestore, "games", data.id);
    await updateDoc(docRef, data.toJSON());
  }

  async getGame(id: string): Promise<Game> {
    const docRef = doc(this.firestore, "games", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const game = new Game({id: docSnap.id, ...docSnap.data() as GameInterface});
      this.gameService.setGame(game);
      return game;
    } else {
      console.error("No such game!");
      await this.router.navigate(['']);
      this.gameService.setModal({
        header: 'Invalid game',
        text: `This game doesn't exist, please try to create new game`
      });
      return null;
    }
  }

  liveGame(id: string): Observable<Game> {
    const docRef = doc(this.firestore, "games", id);
    return docSnapshots(docRef).pipe(map(docSnap => docSnap.exists() ? new Game({id: docSnap.id, ...docSnap.data() as GameInterface}) : null));
  }

  static saveGameLocal(game: GameInterface): void {
    localStorage.setItem('game', JSON.stringify(game));
  }

  static getGameLocal(): GameInterface {
    const item = localStorage.getItem('game');
    return JSON.parse(item) || null;
  }

  static savePlayerLocal(name: string): void {
    localStorage.setItem('player', name);
  }

  static getPlayerLocal(): string {
    return localStorage.getItem('player') || null;
  }
}
