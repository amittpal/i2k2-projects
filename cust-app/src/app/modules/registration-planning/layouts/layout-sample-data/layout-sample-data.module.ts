import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutSampleDataRoutingModule } from './layout-sample-data-routing.module';
import { LayoutSampleDataComponent } from './layout-sample-data.component';
import { LayoutSampleDataFilterComponent } from './layout-sample-data-filter/layout-sample-data-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [LayoutSampleDataComponent, LayoutSampleDataFilterComponent],
  imports: [
    CommonModule,
    LayoutSampleDataRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot()
  ]
})
export class LayoutSampleDataModule { }
