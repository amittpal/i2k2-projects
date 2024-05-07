import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',        
        loadChildren: () => import('./registrations-setup-list/registrations-setup-list.module').then(m => m.RegistrationsSetupListModule)
      },
      {
        path: ':id/manage',        
        loadChildren: () => import('./manage-registration/manage-registration.module').then(m => m.ManageRegistrationModule)
      }          
    ]    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationsSetupRoutingModule { }
