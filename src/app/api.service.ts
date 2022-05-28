import {Injectable} from '@angular/core';
import {Firestore, collection, addDoc, doc, updateDoc, getDoc, docSnapshots} from '@angular/fire/firestore';
import {Game, GameInterface} from './Game.model';
import {Router} from '@angular/router';
import {map, Observable} from 'rxjs';
import {ModalService} from './modal.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  game: Game = null;

  constructor(private firestore: Firestore,
              private modalService: ModalService,
              private router: Router) {
  }

  async getGame(id: string): Promise<Game> {
    if (this.game !== null) return this.game;
    const docRef = doc(this.firestore, "games", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const game = new Game({id: docSnap.id, ...docSnap.data() as GameInterface});
      this.game = game;
      return game;
    } else {
      console.error("No such game!");
      await this.router.navigate(['']);
      this.modalService.setModal({
        header: 'Invalid game',
        text: `This game doesn't exist, please try to create new game`
      });
      return null;
    }
  }

  async createGame(data: GameInterface) {
    try {
      const game = new Game(data);
      const docRef = await addDoc(collection(this.firestore, "games"), game.toJSON());
      game.id = docRef.id;
      this.game = game;
      ApiService.savePlayerLocal(game.creator);
      await this.router.navigate([docRef.id]);
    } catch (e) {
      console.error(e);
      await this.router.navigate(['']);
      this.modalService.setModal({
        header: '¡Ouups!',
        text: e as string || 'something happened! Please try again latter'
      });
    }
  }

  async updateGame(data: Game) {
    const docRef = doc(this.firestore, "games", data.id);
    await updateDoc(docRef, data.toJSON());
  }

  liveGame(id: string): Observable<Game> {
    const docRef = doc(this.firestore, "games", id);
    return docSnapshots(docRef).pipe(map(docSnap => docSnap.exists() ? new Game({id: docSnap.id, ...docSnap.data() as GameInterface}) : null));
  }

  static savePlayerLocal(name: string): void {
    localStorage.setItem('player', name);
  }

  static getPlayerLocal(): string {
    return localStorage.getItem('player') || null;
  }
}
