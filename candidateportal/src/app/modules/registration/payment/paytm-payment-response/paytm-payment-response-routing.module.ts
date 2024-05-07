import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaytmPaymentResponseComponent } from './paytm-payment-response.component';


const routes: Routes = [{ path: '',
data: {
  title: ''
},
children: [
  {
    path: '',
    component: PaytmPaymentResponseComponent,
    data: {
      title: 'PAYTM Payment Gateway'
    }
  }
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaytmPaymentResponseRoutingModule { }
