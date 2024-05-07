import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaytmPaymentGatewayRoutingModule } from './paytm-payment-gateway-routing.module';
import { FormControlDirective, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaytmPaymentGatewayComponent } from './paytm-payment-gateway.component';


@NgModule({
  declarations: [PaytmPaymentGatewayComponent],
  imports: [
    CommonModule,
    PaytmPaymentGatewayRoutingModule, FormsModule,
    ReactiveFormsModule  
  ],
  providers: [
    FormControlDirective,
    FormGroupDirective
  ],
  exports:[PaytmPaymentGatewayComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class PaytmPaymentGatewayModule { }
