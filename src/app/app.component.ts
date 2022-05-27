import {Component} from '@angular/core';
import {Modal, ModalService} from './modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',]
})
export class AppComponent {
  modal: Modal = null;
  isModalOpen = false;

  constructor(modalService: ModalService) {
    modalService.getModal().subscribe(modal => {
      this.modal = modal;
      if (modal !== null) this.isModalOpen = true;
    })
  }

  closed() {
    this.isModalOpen = false;
  }
}
