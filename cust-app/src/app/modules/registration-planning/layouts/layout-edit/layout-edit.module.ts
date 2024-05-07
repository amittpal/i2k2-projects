import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutEditRoutingModule } from './layout-edit-routing.module';
import { LayoutEditComponent } from './layout-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { LoadComponentModule } from 'src/app/directives/load-component/load-component.module';
import { GridsterModule } from 'angular-gridster2';
import { IxcheckLibComponentsModule } from '../ixcheck-lib-components.module';


@NgModule({
  declarations: [LayoutEditComponent],
  imports: [
    CommonModule,
    LayoutEditRoutingModule,    
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    LoadComponentModule,
    GridsterModule,
    IxcheckLibComponentsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],

})
export class LayoutEditModule { }
