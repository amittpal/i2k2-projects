import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaytmPaymentDetailsRoutingModule } from './paytm-payment-details-routing.module';
import { PaytmPaymentDetailsComponent } from './paytm-payment-details.component';
import { FormControlDirective, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PaytmPaymentDetailsComponent],
  imports: [
    CommonModule,
    PaytmPaymentDetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    FormControlDirective,
    FormGroupDirective
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class PaytmPaymentDetailsModule { }
