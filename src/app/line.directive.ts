import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {animate, AnimationControls} from 'motion';

@Directive({
  selector: '[appLine]'
})
export class LineDirective {
  animation: AnimationControls = null;
  @Input() active: boolean;

  constructor(private element: ElementRef) {
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.animation === null && !this.active) this.animation = animate(this.element.nativeElement, {backgroundColor: [null, '#4b4b4b']}, {repeat: Infinity});
  }

  @HostListener('mousedown')
  @HostListener('mouseleave')
  stopAnimation() {
    if (this.animation !== null) {
      this.animation.cancel();
      this.animation = null;
      this.element.nativeElement.style.backgroundColor = '';
    }
  }
}
