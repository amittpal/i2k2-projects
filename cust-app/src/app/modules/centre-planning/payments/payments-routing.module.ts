import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
  path: '',
  data: {
    title: 'Payments'
  },
  children: [
    {
      path: '',
      loadChildren: () => import('./payment-list/payment-list.module').then(m => m.PaymentListModule)
    },
    {
      path: ':id/view',
      loadChildren: () => import('./payment-view/payment-view.module').then(m => m.PaymentViewModule)
    },
    {
      path: 'paytm',
      loadChildren: () => import('./paytm-payment-gateway/paytm-payment-gateway.module').then(m => m.PaytmPaymentGatewayModule)
    },
    {
      path: 'paytm/response/orders/:orderId',
      loadChildren: () => import('./paytm-payment-response/paytm-payment-response.module').then(m => m.PaytmPaymentResponseModule)
    },
    {
      path: 'paytm/details',
      loadChildren: () => import('./paytm-payment-details/paytm-payment-details.module').then(m => m.PaytmPaymentDetailsModule)
    },
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
