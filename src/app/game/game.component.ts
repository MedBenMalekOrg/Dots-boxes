import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Game} from '../Game.model';
import {GameService} from '../game.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, tap} from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css', '../box/box.component.css']
})
export class GameComponent implements OnInit {
  game$: Observable<Game>;
  isReady = false;
  gameJoinForm: FormGroup;
  blockButton = false;
  gamePromise: Promise<Game> = new Promise((resolve) => resolve(null));

  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private api: ApiService,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              formBuilder: FormBuilder) {
    const playerName = ApiService.getPlayerLocal();
    this.gameJoinForm = formBuilder.group({
      name: [playerName, Validators.required]
    })
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.gamePromise = this.api.getGame(id);
    const game = await this.gamePromise;
    if (game === null) {
      this.gameService.setModal({
        header: 'Invalid game',
        text: `This game doesn't exist, please try to create new game`
      });
      await this.router.navigate(['']);
      return;
    }
    this.gameService.setGame(game);
    this.game$ = new Observable<Game>((observer) => observer.next(game));
    const playerName = ApiService.getPlayerLocal();
    if ((playerName === null || !game.players.hasOwnProperty(playerName)) && game.playerNumber === Object.keys(game.players).length) {
      this.gameService.setModal(null);
      this.gameService.setModal({header: 'Game is full', text: 'This game is already full of players'});
      await this.router.navigate(['']);
      return;
    }
    if (playerName !== null && game.players.hasOwnProperty(playerName)) this.liveGame(id);
  }

  liveGame(id: string) {
    this.isReady = true;
    this.game$ = this.api.liveGame(id).pipe(tap({
      next: (game) => {
        if (game.gameEnded()) {
          this.gameService.setModal({
            header: 'Game finished',
            text: `${game.getWinner() ? game.getWinner().name + ' won!' : 'Draw'}`
          })
        }
      }
    }));
  }

  keys(object: { [key: string]: any }): string[] {
    return Object.keys(object);
  }

  async onJoin(game: Game) {
    await this.api.addPlayer(game, this.gameJoinForm.value.name);
    this.liveGame(game.id);
  }

  copyTextToClipboard() {
    const id = this.route.snapshot.paramMap.get('id');
    navigator.clipboard.writeText(`${window.location.hostname}:${window.location.port}/${id}`).then(
      () => alert('Linked copied'),
      () => alert('Share this page link to your friends for them to join')
    );
  }

  replay(game: Game): Promise<void> {
    game.replay();
    return this.api.updateGame(game);
  }
}
