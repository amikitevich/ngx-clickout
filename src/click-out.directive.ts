import {
  Directive,
  Input,
  Output,
  ElementRef,
  EventEmitter, HostListener, HostBinding, AfterViewInit
} from '@angular/core';

const getEventPath = (event: Event): HTMLElement[] => {
  if (event['path']) {
    return event['path'];
  }
  if (event['composedPath']) {
    return event['composedPath']();
  }
  const path = [];
  let node = <HTMLElement>event.target;
  do {
    path.push(node);
  } while (node = node.parentElement);
  return path;
};

@Directive({
  selector: '[clickOut]'
})
export class ClickOutDirective implements AfterViewInit {

  @Input() clickOut: boolean;

  @Output() clickOutEvent: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('attr.tabindex') tabindex = -1;

  @HostListener('document:mousedown', ['$event']) onMouseDown(event: MouseEvent) {

    if (this.clickOut && !getEventPath(event).includes(this._element.nativeElement)) {
      this.clickOutEvent.emit();
    }
  }

  @HostListener('keydown.esc', ['$event'] ) onEsc(event: KeyboardEvent) {
    if (!this.clickOut) {
      return false;
    }

    if (this._element.nativeElement.contains(event.target)) {
      this.clickOutEvent.emit();
    } else {
      this.setFocus();
    }
  }

  constructor(private _element: ElementRef) { }

  ngAfterViewInit(): void {
    this.setFocus();
  }

  private setFocus() {
    this._element.nativeElement.focus();
  }
}
