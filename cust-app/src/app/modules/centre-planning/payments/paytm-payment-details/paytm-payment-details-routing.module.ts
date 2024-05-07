import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaytmPaymentDetailsComponent } from './paytm-payment-details.component';


const routes: Routes = [{ path: '',
data: {
  title: ''
},
children: [
  {
    path: '',
    component: PaytmPaymentDetailsComponent,
    data: {
      title: 'PAYTM Payment Gateway'
    }
  }
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaytmPaymentDetailsRoutingModule { }
