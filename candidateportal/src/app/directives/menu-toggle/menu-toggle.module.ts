import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Directive
import { MenuToggleDirective } from './menu-toggle.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        MenuToggleDirective
    ],
    declarations: [
        MenuToggleDirective
    ]
})
export class MenuToggleModule { }