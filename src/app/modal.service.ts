import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  openModal: Subject<Modal> = new Subject<Modal>();

  constructor() { }

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
