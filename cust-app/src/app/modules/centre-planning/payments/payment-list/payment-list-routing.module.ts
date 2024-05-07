import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentListComponent } from './payment-list.component';


const routes: Routes = [{
  path: '',
  data: {
    title: 'payment-list'
  },
  component: PaymentListComponent

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentListRoutingModule { }
