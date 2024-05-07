import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAdmitCardComponent } from './manage-admit-card.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'manage'
    },
    component: ManageAdmitCardComponent
   
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAdmitCardRoutingModule { }
