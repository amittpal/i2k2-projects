import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAdmitCardViewListComponent } from './manage-admit-card-view-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admit Card View List'
    },
    children: [
      {
        path: '',
        component: ManageAdmitCardViewListComponent,
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
export class ManageAdmitCardViewListRoutingModule { }
