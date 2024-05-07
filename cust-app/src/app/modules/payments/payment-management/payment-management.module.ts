import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentManagementRoutingModule } from './payment-management-routing.module';
import { PaymentManagementComponent } from './payment-management.component';
import { PaymentManagementFilterComponent } from './payment-management-filter/payment-management-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';


@NgModule({
  declarations: [PaymentManagementComponent, PaymentManagementFilterComponent, PaymentDetailComponent],
  imports: [
    CommonModule,
    PaymentManagementRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,    
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot()
  ]
})
export class PaymentManagementModule { }
