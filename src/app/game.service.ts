import {Injectable} from '@angular/core';
import {Box, Game} from './Game.model';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  game: Game;
  openModal: Subject<Modal> = new Subject<Modal>();

  setGame(game: Game) {
    this.game = game;
  }

  getGame(): Game {
    return this.game;
  }

  getBox(id: number): Box {
    return this.game.getBox(id)
  }

  setModal(modal: Modal): void {
    this.openModal.next(modal)
  }

  getModal(): Observable<Modal> {
    return this.openModal;
  }
}

export interface Modal {
  header: string;
  text: string
}
