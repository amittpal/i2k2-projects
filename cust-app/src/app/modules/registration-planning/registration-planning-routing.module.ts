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
        path: '',
        loadChildren: () => import('./layouts/layouts.module').then(m => m.LayoutsModule)
      },
      {
        path: 'setup',
        loadChildren: () => import('./setup/registrations-setup.module').then(m => m.RegistrationsSetupModule)
      },
      {
        path: 'payment/gateway',
        loadChildren: () => import('./payment-gateway/payment-gateway.module').then(m => m.PaymentGatewayModule)
      },      
      {
        path: 'publish',
        loadChildren: () => import('./publish/publish.module').then(m => m.PublishModule)
      }       
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationPlanningRoutingModule { }
