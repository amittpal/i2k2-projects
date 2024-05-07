import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentManagementComponent } from './payment-management.component'


const routes: Routes = [
  {
    path:'',
    component: PaymentManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentManagementRoutingModule { }
