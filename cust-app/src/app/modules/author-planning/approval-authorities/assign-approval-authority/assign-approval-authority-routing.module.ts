import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignApprovalAuthorityComponent } from './assign-approval-authority.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: AssignApprovalAuthorityComponent,
        data: {
          title: 'Assign Approval Authority Component'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignApprovalAuthorityRoutingModule { }
