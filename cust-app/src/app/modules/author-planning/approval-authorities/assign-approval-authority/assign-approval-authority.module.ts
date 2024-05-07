import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignApprovalAuthorityRoutingModule } from './assign-approval-authority-routing.module';
import { AssignApprovalAuthorityComponent } from './assign-approval-authority.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AssignApprovalAuthorityComponent],
  imports: [
    CommonModule,
    AssignApprovalAuthorityRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AssignApprovalAuthorityModule { }
