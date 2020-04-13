import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appContenedorListProvOfer]'
})
export class ContenedorListProvOferDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
