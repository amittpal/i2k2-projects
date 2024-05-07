import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePaymentGatewayViewComponent } from './manage-payment-gateway-view.component';
import { ManagePaymentGatewayViewRoutingModule } from './manage-payment-gateway-view-routing.module';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { PaytmViewComponent } from './payment-gateways-view/paytm-view/paytm-view.component';
import { PayumoneyViewComponent } from './payment-gateways-view/payumoney-view/payumoney-view.component';
import { RazorpayViewComponent } from './payment-gateways-view/razorpay-view/razorpay-view.component';

@NgModule({
  declarations: [ManagePaymentGatewayViewComponent, PaytmViewComponent, RazorpayViewComponent,PayumoneyViewComponent],
  imports: [
    CommonModule,
    ManagePaymentGatewayViewRoutingModule,
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
export class ManagePaymentGatewayViewModule { }
