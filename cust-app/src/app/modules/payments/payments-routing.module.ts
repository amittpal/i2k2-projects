import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'payments'
    },
    children: [
      {
        path: 'list',
        loadChildren: () => import('./payments-list/payments-list.module').then(m => m.PaymentsListModule)
      },
      {
        path: 'candidates/registration/:id/payment/manage',
        loadChildren: () => import('./payment-management/payment-management.module').then(m => m.PaymentManagementModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
