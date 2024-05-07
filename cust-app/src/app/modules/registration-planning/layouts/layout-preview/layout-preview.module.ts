import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutPreviewRoutingModule } from './layout-preview-routing.module';
import { LayoutPreviewComponent } from './layout-preview.component';
import { LayoutPreviewFilterComponent } from './layout-preview-filter/layout-preview-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule, ModalModule } from 'ngx-bootstrap';
import { LoadComponentModule } from 'src/app/directives/load-component/load-component.module';
import { IxcheckLibComponentsModule } from '../ixcheck-lib-components.module';
import { GridsterModule } from 'angular-gridster2';


@NgModule({
  declarations: [LayoutPreviewComponent,LayoutPreviewFilterComponent],
  imports: [
    CommonModule,
    LayoutPreviewRoutingModule,                
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    LoadComponentModule,   
    IxcheckLibComponentsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    GridsterModule
  ]
})
export class LayoutPreviewModule { }
