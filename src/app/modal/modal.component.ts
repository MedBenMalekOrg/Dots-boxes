import {Component} from '@angular/core';
import {ModalDirective} from '../modal.directive';
import {ModalService} from '../modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  header: string;
  text: string;
  constructor(private modalService: ModalService) { }

  close() {
    if (ModalDirective.vcRef) {
      ModalDirective.vcRef.clear();
    }
    this.modalService.setModal(null);
  }

}
