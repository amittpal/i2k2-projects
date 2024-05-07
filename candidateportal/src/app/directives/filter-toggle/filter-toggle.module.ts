import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Directive
import { FilterToggleDirective, FilterCloseDirective, FilterMobileDirective } from '../filter-toggle/filter-toggle.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        FilterToggleDirective,
        FilterCloseDirective,
        FilterMobileDirective
    ],
    declarations: [
        FilterToggleDirective,
        FilterCloseDirective,
        FilterMobileDirective
    ]
})
export class FilterToggleModule { }