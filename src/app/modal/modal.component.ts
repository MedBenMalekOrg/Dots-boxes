import {Component, Input} from '@angular/core';
import {ModalDirective} from '../modal.directive';
import {GameService} from '../game.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  header: string;
  text: string;
  constructor(private gameService: GameService) { }

  close() {
    if (ModalDirective.vcRef) {
      ModalDirective.vcRef.clear();
    }
    this.gameService.setModal(null);
  }

}
