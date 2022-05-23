import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {ModalComponent} from './modal/modal.component';
import {GameService} from './game.service';

@Directive({
  selector: '[appModal]'
})
export class ModalDirective implements OnChanges {
  @Input() header: string;
  @Input() text: string;
  @Input() open = false;
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  static vcRef: ViewContainerRef

  constructor(vcRef: ViewContainerRef) {
    ModalDirective.vcRef = vcRef;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      if (changes['open'].currentValue) {
        const modal = ModalDirective.vcRef.createComponent(ModalComponent);
        modal.instance.text = this.text;
        modal.instance.header = this.header;
        modal.onDestroy(() => {
          this.closed.emit();
        })
      }
    }
  }

}
