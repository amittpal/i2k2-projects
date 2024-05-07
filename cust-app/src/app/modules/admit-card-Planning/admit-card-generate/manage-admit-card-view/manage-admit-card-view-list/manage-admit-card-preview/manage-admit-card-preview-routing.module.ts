import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAdmitCardPreviewComponent } from './manage-admit-card-preview.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admit Card Preview'
    },
    children: [
      {
        path: '',
        component: ManageAdmitCardPreviewComponent,
        data: {
            title: 'Manage Admit Card Preview'
        }
      }     
    ]    
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAdmitCardPreviewRoutingModule { }
