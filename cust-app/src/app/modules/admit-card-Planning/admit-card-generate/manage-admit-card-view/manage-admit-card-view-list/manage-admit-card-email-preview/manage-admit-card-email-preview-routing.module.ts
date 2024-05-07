import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAdmitCardEmailPreviewComponent } from './manage-admit-card-email-preview.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admit Card Email Preview'
    },
    children: [
      {
        path: '',
        component: ManageAdmitCardEmailPreviewComponent,
        data: {
            title: 'Manage Admit Card Email Preview'
        }
      }     
    ]    
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAdmitCardEmailPreviewRoutingModule { }
