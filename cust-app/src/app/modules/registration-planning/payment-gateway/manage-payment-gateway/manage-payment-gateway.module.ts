import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagePaymentGatewayRoutingModule } from './manage-payment-gateway-routing.module';
import { ManagePaymentGatewayComponent } from './manage-payment-gateway.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { DemoComponent } from './demo/demo.component';
import { LiveComponent } from './live/live.component';
import { PaytmComponent } from './payment-gateways/paytm/paytm.component';
import { PayumoneyComponent } from './payment-gateways/payumoney/payumoney.component';
import { RazorpayComponent } from './payment-gateways/razorpay/razorpay.component';



@NgModule({
  declarations: [ManagePaymentGatewayComponent, DemoComponent, LiveComponent, PaytmComponent, PayumoneyComponent, RazorpayComponent],
  imports: [
    CommonModule,
    ManagePaymentGatewayRoutingModule,
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
export class ManagePaymentGatewayModule { }
