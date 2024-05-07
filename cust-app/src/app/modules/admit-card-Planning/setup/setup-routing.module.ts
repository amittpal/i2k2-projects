import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',        
        component:SetupComponent,
      },
      {
        path: ':registrationGuid/manage',        
        loadChildren: () => import('./manage-admit-card/manage-admit-card.module').then(m => m.ManageAdmitCardModule)
      },
      {
        path: ':registrationGuid/view',
        loadChildren: () => import('./manage-admit-card-view/manage-admit-card-view.module').then(m => m.ManageAdmitCardViewModule)
      }          
    ]    
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
