import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Manage Admit Card Generation'
    },
    children: [
      {
        path: '',        
        loadChildren: () => import('./manage-admit-card-list/manage-admit-card-list.module').then(m => m.ManageAdmitCardListModule)
      }          
    ]    
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAdmitCardGenerateRoutingModule { }
