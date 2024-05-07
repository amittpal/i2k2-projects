import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
  path: '',
  data: {
    title: 'Payment Gateway'
  },
  children: [    
    {
      path: 'registration/:registrationGuid/id/:id/manage',
      loadChildren: () => import('./manage-payment-gateway/manage-payment-gateway.module').then(m => m.ManagePaymentGatewayModule)
    },
    {
      path: 'registration/:registrationGuid/id/:id/manage/view',
      loadChildren: () => import('./manage-payment-gateway-view/manage-payment-gateway-view.module').then(m => m.ManagePaymentGatewayViewModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentGatewayRoutingModule { }
