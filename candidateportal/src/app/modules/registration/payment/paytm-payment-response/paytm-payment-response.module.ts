import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaytmPaymentResponseRoutingModule } from './paytm-payment-response-routing.module';
import { PaytmPaymentResponseComponent } from './paytm-payment-response.component';
import { FormControlDirective, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PaytmPaymentResponseComponent],
  imports: [
    CommonModule,
    PaytmPaymentResponseRoutingModule ,FormsModule,
    ReactiveFormsModule  ,
  ],
  providers: [
    FormControlDirective,
    FormGroupDirective
  ],
  schemas: [
    NO_ERRORS_SCHEMA
    ]
})
export class PaytmPaymentResponseModule { }
