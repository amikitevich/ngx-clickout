import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutDirective } from './click-out.directive';

export * from './click-out.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ClickOutDirective
  ],
  exports: [
    ClickOutDirective
  ]
})
export class ClickOutModule {
}
