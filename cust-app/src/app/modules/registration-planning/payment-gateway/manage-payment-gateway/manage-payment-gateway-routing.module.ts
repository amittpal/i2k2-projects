import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagePaymentGatewayComponent } from './manage-payment-gateway.component';


const routes: Routes = [{
  path: '',
  data: {
    title: 'manage'
  },
  component:ManagePaymentGatewayComponent
 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePaymentGatewayRoutingModule { }
