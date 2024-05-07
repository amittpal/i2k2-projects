import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admit Card View'
    },
    children: [
      {
        path: 'view/:shiftNo',        
        loadChildren: () => import('./manage-admit-card-view-list/manage-admit-card-view-list.module').then(m => m.ManageAdmitCardViewListModule)
      },
      {
        path: 'shiftNo/:shiftNo/candidate/:candidateGuid/admitcard/preview',        
        loadChildren: () => import('./manage-admit-card-view-list/manage-admit-card-preview/manage-admit-card-preview.module').then(m => m.ManageAdmitCardPreviewModule)
      },
      {
        path: 'shiftNo/:shiftNo/candidate/:candidateGuid/admitcard/email/preview',        
        loadChildren: () => import('./manage-admit-card-view-list/manage-admit-card-email-preview/manage-admit-card-email-preview.module').then(m => m.ManageAdmitCardEmailPreviewModule)
      }      
    ]    
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAdmitCardViewRoutingModule { }
