import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentViewRoutingModule } from './payment-view-routing.module';
import { PaymentViewComponent } from './payment-view.component';
import { LivePaymentComponent } from './live-payment/live-payment.component';
import { TrialPaymentComponent } from './trial-payment/trial-payment.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { LivePaymentFilterComponent } from './live-payment/live-payment-filter/live-payment-filter.component';


@NgModule({
  declarations: [PaymentViewComponent, LivePaymentComponent, TrialPaymentComponent, LivePaymentFilterComponent],
  imports: [
    CommonModule,
    PaymentViewRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
  ]
})
export class PaymentViewModule { }
