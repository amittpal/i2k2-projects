import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutMappingListRoutingModule } from './layout-mapping-list-routing.module';
import { LayoutMappingListComponent } from './layout-mapping-list.component';
import { LayoutMappingListFilterComponent } from './layout-mapping-list-filter/layout-mapping-list-filter.component';
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
  declarations: [LayoutMappingListComponent, LayoutMappingListFilterComponent],
  imports: [
    CommonModule,
    LayoutMappingListRoutingModule,                 
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
export class LayoutMappingListModule { }
