import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Game} from '../Game.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Observable, tap} from 'rxjs';
import {ModalService} from '../modal.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css', '../box/box.component.css']
})
export class GameComponent implements OnInit {
  readonly gameJoinForm: UntypedFormGroup;
  game$: Observable<Game>;
  isReady = false;
  blockButton = false;

  constructor(private modalService: ModalService,
              private route: ActivatedRoute,
              private api: ApiService,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              formBuilder: UntypedFormBuilder) {
    const playerName = ApiService.getPlayerLocal();
    this.gameJoinForm = formBuilder.group({
      name: [playerName, [Validators.required, Validators.min(3)]]
    });
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.game$ = this.api.liveGame(id).pipe(tap({
      next: async (game) => {
        if (game === null) {
          this.modalService.setModal({
            header: 'Invalid game',
            text: `This game doesn't exist, please try to create new game`
          });
          await this.router.navigate(['']);
          return;
        }
        const playerName = ApiService.getPlayerLocal();
        if ((playerName === null || !game.players.hasOwnProperty(playerName)) && game.playerNumber === Object.keys(game.players).length) {
          this.modalService.setModal(null);
          this.modalService.setModal({header: 'Game is full', text: 'This game is already full of players'});
          await this.router.navigate(['']);
          return;
        }
        if (!this.isReady && playerName !== null && game.players.hasOwnProperty(playerName)) this.isReady = true;
        if (game.gameEnded()) {
          this.modalService.setModal({
            header: 'Game finished',
            text: game.getWinnerText()
          });
        }
      },
      error: (e) => {
        console.error(e);
        this.modalService.setModal({
          header: 'Ouups, Something happened!',
          text: 'Try again later please!'
        });
      }
    }));
  }

  keys(object: { [key: string]: any }): string[] {
    return Object.keys(object);
  }

  async onJoin(game: Game): Promise<void> {
    this.blockButton = true;
    try {
      game.addPlayer(this.gameJoinForm.value.name);
      await this.api.updateGame(game);
      this.blockButton = false;
    } catch (e) {
      console.error(e);
      this.modalService.setModal({
        header: 'Ouups, Something happened!',
        text: 'Try again later please!'
      });
      this.blockButton = false;
    }

  }

  copyTextToClipboard(): void {
    const id = this.route.snapshot.paramMap.get('id');
    navigator.clipboard.writeText(`https://${window.location.hostname}:${window.location.port}/${id}`).then(
      () => alert('Linked copied'),
      () => alert('Share this page link to your friends for them to join')
    );
  }

  async replay(game: Game): Promise<void> {
    this.blockButton = true;
    try {
      game.replay();
      await this.api.updateGame(game);
      this.blockButton = false;
    } catch (e) {
      console.error(e);
      this.modalService.setModal({
        header: 'Ouups, Something happened!',
        text: 'Try again later please!'
      });
      this.blockButton = false;
    }
  }
}
