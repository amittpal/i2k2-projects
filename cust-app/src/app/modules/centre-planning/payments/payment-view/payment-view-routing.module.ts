import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentViewComponent } from './payment-view.component';


const routes: Routes = [{
  path: '',
  data: {
    title: 'manage'
  },
  component:PaymentViewComponent
 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentViewRoutingModule { }
