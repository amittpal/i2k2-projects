import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutMappingAddRoutingModule } from './layout-mapping-add-routing.module';
import { LayoutMappingAddComponent } from './layout-mapping-add.component';
import { LayoutMappingAddFilterComponent } from './layout-mapping-add-filter/layout-mapping-add-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';
import {NgxIxcheckReportsViewerModule} from './../../../../../../app/components/ngx-ixcheck-reports-viewer/ngx-ixcheck-reports-viewer.module';



@NgModule({
  declarations: [LayoutMappingAddComponent, LayoutMappingAddFilterComponent],
  imports: [
    CommonModule,
    LayoutMappingAddRoutingModule,                 
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    NgxIxcheckReportsViewerModule
  ]
})
export class LayoutMappingAddModule { }
