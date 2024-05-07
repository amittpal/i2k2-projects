import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsListRoutingModule } from './payments-list-routing.module';
import { PaymentsListComponent } from './payments-list.component';
import { PaymentsDetailComponent } from './payments-detail/payments-detail.component';
import { PaymentsFilterComponent } from './payments-filter/payments-filter.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterToggleModule } from './../../../directives/filter-toggle/filter-toggle.module';
import { MenuToggleModule } from './../../../directives/menu-toggle/menu-toggle.module';
import { AngularSvgIconModule } from 'angular-svg-icon';


@NgModule({
  declarations: [PaymentsListComponent, PaymentsFilterComponent, PaymentsDetailComponent],
  imports: [
    CommonModule,
    PaymentsListRoutingModule,
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
export class PaymentsListModule { }
