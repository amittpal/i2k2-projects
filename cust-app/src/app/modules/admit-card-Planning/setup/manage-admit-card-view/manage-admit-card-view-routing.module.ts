import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAdmitCardViewComponent } from './manage-admit-card-view.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'manage'
    },
    component: ManageAdmitCardViewComponent
   
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAdmitCardViewRoutingModule { }
