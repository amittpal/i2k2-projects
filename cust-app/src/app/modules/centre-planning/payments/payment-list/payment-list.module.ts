import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentListRoutingModule } from './payment-list-routing.module';
import { PaymentListComponent } from './payment-list.component';
import { PaymentListFilterComponent } from './payment-list-filter/payment-list-filter.component';
import { IxcheckLibComponentsModule } from '../ixcheck-lib-components.module';
import { LoadComponentModule } from 'src/app/directives/load-component/load-component.module';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { AngularSvgIconModule } from 'angular-svg-icon';


@NgModule({
  declarations: [PaymentListComponent, PaymentListFilterComponent],
  imports: [
    CommonModule,
    PaymentListRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    LoadComponentModule,   
    IxcheckLibComponentsModule,
  ]
})
export class PaymentListModule { }
