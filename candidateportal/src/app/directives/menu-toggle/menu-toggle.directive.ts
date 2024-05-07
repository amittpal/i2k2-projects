import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[menuToggle]'
})
export class MenuToggleDirective {

  constructor() { }
  @HostListener('click', ['$event'])
  toggleMenu($event: any) {
    $event.preventDefault();
    $event.stopPropagation();
    document.querySelector('body').classList.toggle('az-iconbar-show');
  }
}
