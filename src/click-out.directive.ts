import {
  Directive,
  Input,
  Output,
  OnChanges,
  OnInit,
  OnDestroy,
  ElementRef,
  SimpleChanges,
  EventEmitter
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/skipUntil';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

const ESC_CODE = 27;

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

interface MouseEventExtended extends MouseEvent {
  path: Node[];
}

@Directive({
  selector: '[clickOut]'
})
export class ClickOutDirective implements OnChanges, OnInit, OnDestroy {

  @Input() clickOut: boolean;
  @Input() clickOutFilter: string;

  @Output() clickOutEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  private documentClick$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private clickSub: Subscription;

  constructor(private _element: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('clickOut') && changes[ 'clickOut' ] !== null) {
      this.documentClick$.next(this.clickOut);
    }
  }

  ngOnInit(): void {
    this.setTabIndex();
    this.clickSub = this.getActiveState()
      .do(state => this.setFocus())
      .flatMap(
        (state: boolean) => Observable.merge(
          this.getClickEvent(),
          this.getEscEvent()
        )
      )
      .subscribe(
        () => {
          this.clickOutEvent.emit(false);
          console.log('click out');
        },
        error => console.warn(error)
      );
  }
  ngOnDestroy(): any {
    this.clickSub.unsubscribe();
  }

  getClickEvent(): Observable<any> {
    return Observable.fromEvent(document, 'click')
      .skipUntil(Observable.timer(50))
      .takeUntil(this.getInActiveState())
      .filter(this.getFilterByFunction().bind(this));
  }

  getEscEvent(): Observable<any> {

    return Observable.fromEvent(this._element.nativeElement, 'keyup')
      .filter(this.filterAndSetFocusToParent.bind(this))
      .takeUntil(this.getInActiveState());
  }

  private filterAndSetFocusToParent(keyEvent: KeyboardEvent): boolean {
    let isInside: boolean = this._element.nativeElement.contains(
      keyEvent.target
    );

    if (!isInside) {
      this.setFocus();
    }

    return keyEvent.keyCode === ESC_CODE && isInside;
  }

  private setTabIndex() {
    this._element.nativeElement.setAttribute('tabIndex', '-1');
  }

  private setFocus() {
    this._element.nativeElement.focus();
  }

  private getFilterByFunction(): Function {
    let resultFunction: Function;
    switch (this.clickOutFilter) {
      case 'rect':
         resultFunction = this.filterEventByRect;
        break;
      case 'target':
        resultFunction = this.filterEventByTarget;
        break;
      default:
        resultFunction = this.filterEventByTarget;
    }
    return resultFunction;
  }

  private filterEventByRect(event: MouseEvent): boolean {
    let rect = this._element.nativeElement.getBoundingClientRect();
    let notNull: boolean = event.clientX > 0 && event.clientY > 0;
    let outsideByX: boolean = event.clientX <= rect.left || event.clientX >= rect.right;
    let outsideByY: boolean = event.clientY <= rect.top || event.clientY >= rect.bottom;
    return notNull && (outsideByX || outsideByY);
  }

  private filterEventByTarget(event: MouseEventExtended): boolean {

    return !getEventPath(event).includes(this._element.nativeElement);
  }

  private getActiveState() {
    return this.documentClick$.filter(isActive => isActive === true);
  }

  private getInActiveState() {
    return this.documentClick$.filter(isActive => isActive === false);
  }

}
