import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAdmitCardGenerateComponent } from './manage-admit-card-generate.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: ManageAdmitCardGenerateComponent,
        data: {
          title: 'Manage Admit Card Generate'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAdmitCardGenerateRoutingModule { }
