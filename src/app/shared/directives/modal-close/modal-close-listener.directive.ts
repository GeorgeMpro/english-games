import {Directive, ElementRef, HostListener, input, output} from '@angular/core';

@Directive({
  selector: '[appModalCloseListener]',
  standalone: true,
})
export class ModalCloseListenerDirective {
  /** Event emitted when modal should close */
  readonly modalClose = output<void>();

  constructor(private el: ElementRef) {
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.modalClose.emit();
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.modalClose.emit();
    }
  }
}
