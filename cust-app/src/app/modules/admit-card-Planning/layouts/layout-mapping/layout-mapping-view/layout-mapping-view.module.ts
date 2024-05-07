import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutMappingViewRoutingModule } from './layout-mapping-view-routing.module';
import { LayoutMappingViewComponent } from './layout-mapping-view.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap'
import {NgxIxcheckReportsViewerModule} from './../../../../../../app/components/ngx-ixcheck-reports-viewer/ngx-ixcheck-reports-viewer.module';



@NgModule({
  declarations: [LayoutMappingViewComponent],
  imports: [
    CommonModule,
    LayoutMappingViewRoutingModule,                 
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
export class LayoutMappingViewModule { }
