import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Registration'
    },
    children: [
      {
        path: 'exam/:examId',
        loadChildren: () => import('./registration-add/registration-add.module').then(m => m.RegistrationAddModule)
      },
      {
        path: 'exam/:examId/edit',
        loadChildren: () => import('./registration-edit/registration-edit.module').then(m => m.RegistrationEditModule)
      },
      {
        path: 'exam/:examId/view',
        loadChildren: () => import('./registration-view/registration-view.module').then(m => m.RegistrationViewModule)
      },
      {
        path: 'exam/payment/paytm',
        loadChildren: () => import('./payment/paytm-payment-gateway/paytm-payment-gateway.module').then(m => m.PaytmPaymentGatewayModule)
      },
      {
        path: 'exam/payment/view/orders',
        loadChildren: () => import('./payment/paytm-payment-response/paytm-payment-response.module').then(m => m.PaytmPaymentResponseModule)
      }                                                                
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
