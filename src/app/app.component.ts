import {Component} from '@angular/core';
import {GameService, Modal} from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',]
})
export class AppComponent {
  modal: Modal = null;
  isModalOpen = false;

  constructor(gameService: GameService) {
    gameService.getModal().subscribe(modal => {
      this.modal = modal;
      if (modal !== null) this.isModalOpen = true;
    })
  }

  closed() {
    this.isModalOpen = false;
  }
}
