import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaytmPaymentGatewayComponent } from './paytm-payment-gateway.component';


const routes: Routes = [ {
  path: '',
  data: {
    title: ''
  },
  children: [
    {
      path: '',
      component: PaytmPaymentGatewayComponent,
      data: {
        title: 'PAYTM Payment Gateway'
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaytmPaymentGatewayRoutingModule { }
