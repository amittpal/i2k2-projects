import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagePaymentGatewayViewComponent } from './manage-payment-gateway-view.component';


const routes: Routes = [{
    path: '',
    data: {
        title: 'manage'
    },
    component: ManagePaymentGatewayViewComponent

}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManagePaymentGatewayViewRoutingModule { }
